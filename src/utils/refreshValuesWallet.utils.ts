import { PrismaClient, Wallet } from '@prisma/client';
import { AppError } from 'src/errors';
import api from 'src/services/api';

export default async function refreshValuesWallet(wallet: Wallet) {
  try {
    const prisma = new PrismaClient();

    const currency = await prisma.currency.findUnique({
      where: { id: wallet.currencyId },
    });

    let consult = `BRL-${currency.iso4217}`;
    let responseApi = await api.get(`/${consult}`);
    consult = consult.replace('-', '');

    const valueBase = (
      wallet.valueBase * responseApi.data[consult].bid
    ).toFixed(2);

    consult = `${currency.iso4217}-BRL`;
    responseApi = await api.get(`/${consult}`);
    consult = consult.replace('-', '');

    const refresh = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        valueBase: parseFloat(valueBase),
        exchangeOfDay: parseFloat(responseApi.data[consult].bid),
        lastUpdateExchange: new Date(responseApi.data[consult].create_date),
      },
    });

    return refresh;
  } catch (error) {
    throw new AppError('Error to refresh wallets', 500);
  }
}
