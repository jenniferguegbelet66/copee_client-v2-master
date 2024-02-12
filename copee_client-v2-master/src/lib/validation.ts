// Form data validation functions
export const validateAge = (age: number) => age >= 18;

export const email_regex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const frenchPhoneNumbers_regex =
  /^0[1-7]{1}(([0-9]{2}){4})|((\s[0-9]{2}){4})|((-[0-9]{2}){4})$/;
export const internationalPhoneNumbers_regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

export const validatePostCode = (postcode: string): boolean => {
  const re = /\d{5}/;
  return re.test(postcode);
};

export const validateFirstName = (firstName: string): boolean => {
  return validateLastName(firstName);
};

export const validateLastName = (name: string): boolean => {
  const re =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  return re.test(name);
};

export const validatePhone = (phone: string): boolean => {
  return (
    frenchPhoneNumbers_regex.test(phone) ||
    internationalPhoneNumbers_regex.test(phone)
  );
};

export const validateEmail = (email: string): boolean => {
  //https://www.w3resource.com/javascript/form/email-validation.php
  return !!email.length && email_regex.test(email.toLowerCase());
};

export const validateFiscalYearIncome = (income: string): boolean => {
  return Number(income) > 0;
};

// export const validateDate() = (date: string): boolean => {
// const datemoment = moment(date);
// const dateFormat = "YYYY-MM-DDTHH:mm:ss.sssZ";
// return (
//   moment.isMoment(datemoment) && moment(date, dateFormat, true).isValid()
// );
// };

export const validateDatas = (
  formData: FormData,
  dataValidators: FormDataValidator[]
): ClientValidationErrors => {
  const clientValidationErrors: ClientValidationErrors = {};

  dataValidators.forEach((data: FormDataValidator) => {
    const propName: string = Object.keys(data)[0];
    const validateFunc: (param: string) => boolean =
      data[propName].dataValidatorFunc;
    const message: string = data[propName].message;
    let value: FormDataEntryValue | null = formData.get(propName);
    if (value !== null && typeof value === "string") {
      if (value !== "") {
        const isValid: boolean = validateFunc(value);
        clientValidationErrors[propName] = {
          error: !isValid,
          message: !isValid ? message : "",
        };
      } else {
        clientValidationErrors[propName] = {
          error: true,
          message: "champ incomplet",
        };
      }
    }
  });

  return clientValidationErrors;
};

export const findErrorsInDataValidation = (
  dataValidationErrors: ClientValidationErrors
): boolean => {
  for (let dataValidationError in dataValidationErrors) {
    if (dataValidationErrors[dataValidationError].error) {
      return true;
    }
  }
  return false;
};

export type ClientValidationErrors = {
  [formElement: string]: { error: boolean; message: string };
};

export type FormDataValidator = {
  [propertyName: string]: {
    dataValidatorFunc: (param: string) => boolean;
    message: string;
  };
};

export const validateTypes = (clientFormDataEntryValues: object) => {
  for (const val in clientFormDataEntryValues) {
    if (typeof val !== "string") {
      return false;
    }
  }
  return true;
};
