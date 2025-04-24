import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 3 })
      .withMessage("username should be greater than 3 digit")
      .isLength({ max: 13 })
      .withMessage("username shoudl be less than 13 digit"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must be greater then 8 digit")
      .isLength({ max: 20 })
      .withMessage("password must be less than 20 digits")
      .matches(/[a-z]/)
      .withMessage("password must contain atleast one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("password must contain atleast one Uppercase letter")
      .matches(/[0-9]/)
      .withMessage("password must contain atleast one number")
      .not()
      .matches(/\s/)
      .withMessage("password should not contain spaces")
      .custom((value) => {
        const specialcharacter = value.match(/[@$!%*?&#]/g);
        if (!specialcharacter || specialcharacter.length !== 1) {
          throw new Error(
            "password must contain atleast one special character",
          );
        }
        return true;
      }),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("password cannot be empty")
      .isLength({ min: 8 })
      .withMessage("password must be greater then 8 digit")
      .isLength({ max: 20 })
      .withMessage("password must be less than 20 digits"),
  ];
};

const ResetPasswordValidator = () => {
  return [
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("password must be greater then 8 digit")
      .isLength({ max: 20 })
      .withMessage("password must be less than 20 digits")
      .matches(/[a-z]/)
      .withMessage("password must contain atleast one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("password must contain atleast one Uppercase letter")
      .matches(/[0-9]/)
      .withMessage("password must contain atleast one number")
      .not()
      .matches(/\s/)
      .withMessage("password should not contain spaces")
      .custom((value) => {
        const specialcharacter = value.match(/[@$!%*?&#]/g);
        if (!specialcharacter || specialcharacter.length !== 1) {
          throw new Error(
            "password must contain atleast one special character",
          );
        }

        return true;
      }),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid")
      .normalizeEmail(),
  ];
};

const emailvalidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid")
      .normalizeEmail(),
  ];
};

export {
  userRegistrationValidator,
  userLoginValidator,
  ResetPasswordValidator,
  forgotPasswordValidator,
  emailvalidator,
};
