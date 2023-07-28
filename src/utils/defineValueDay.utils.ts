import { AppError } from 'src/errors';
import { CreateRegisterDto } from 'src/registers/dto/create-register.dto';
import api from 'src/services/api';

export default async function defineValueDay(
  createRegisterDto: CreateRegisterDto,
  currency: any,
) {
  let currencyResponse = null;

  if (createRegisterDto.valueCurrent) {
    let consult = `${currency.iso4217}-BRL`;
    await api
      .get(consult)
      .then((response) => (currencyResponse = response.data))
      .catch((error) => {
        throw new AppError(error.message, error.statusCode);
      });
    consult = consult.replace('-', '');
    currencyResponse = parseFloat(currencyResponse[consult].bid).toFixed(4);
    currencyResponse = parseFloat(currencyResponse);
    const valueBase = createRegisterDto.valueCurrent * currencyResponse;

    createRegisterDto.valueBase = parseFloat(valueBase.toFixed(2));

    return currencyResponse;
  } else {
    let consult = `BRL-${currency.iso4217}`;
    await api
      .get(consult)
      .then((response) => (currencyResponse = response.data))
      .catch((error) => {
        console.log(error.message, error.statusCode);
      });
    consult = consult.replace('-', '');
    currencyResponse = parseFloat(currencyResponse[consult].bid);
    currencyResponse = currencyResponse.toFixed(4);
    currencyResponse = parseFloat(currencyResponse);
    const valueCurrent = currencyResponse * createRegisterDto.valueBase;

    createRegisterDto.valueCurrent = parseFloat(valueCurrent.toFixed(2));

    consult = `${currency.iso4217}-BRL`;
    await api
      .get(consult)
      .then((response) => (currencyResponse = response.data))
      .catch((error) => {
        console.log(error.message, error.statusCode);
      });
    consult = consult.replace('-', '');

    currencyResponse = parseFloat(currencyResponse[consult].bid).toFixed(4);

    return parseFloat(currencyResponse);
  }
}
