import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Copyright } from "../../../../components/ui/copyright/copyright";
import EditIcon from "@mui/icons-material/EditNote";
import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
  useSubmit,
} from "react-router-dom";
import { PersonAdd } from "@mui/icons-material";

import { clientsApi } from "../../../../components/store/api/copee/clientsApiSlice";
import {
  COPEE_APPLI_CLIENT,
  COPEE_APPLI_CLIENT_LIST,
} from "../../../../components/store/types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Snackbar,
  Stack,
} from "@mui/material";
import { ApiResponse, ClientApiResponse } from "../../../types";
import "./index.css";
import { store } from "../../../../components/store";
import { SubmitHandler, useForm, useController } from "react-hook-form";
import {
  email_regex,
  frenchPhoneNumbers_regex,
  internationalPhoneNumbers_regex,
} from "@/lib/validation";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";
import { compareObjects } from "@/lib/objects";
import { Clients } from "@/lib/Clients";

interface Inputs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fiscalYearIncome: string;
  birthdate: dayjs.Dayjs | null;
  phoneFormat: string;
}

export const getClientFromClientId = (
  clients: COPEE_APPLI_CLIENT_LIST,
  clientId: number
): COPEE_APPLI_CLIENT | undefined => {
  return clients.find((client: COPEE_APPLI_CLIENT) => {
    return client.client_id === clientId;
  });
};

export const getCurrentClient = async (clientId: string) => {
  let client: COPEE_APPLI_CLIENT | undefined;
  const stateClients = await store.dispatch(
    clientsApi.endpoints.fetchClients.initiate({ requestArgs: {} })
  );
  if (stateClients.data) {
    const clients = new Clients(stateClients.data);
    client = clients.findClientById(Number(clientId));
  }
  return client;
};

export const loader = async (
  clientId: string
): Promise<COPEE_APPLI_CLIENT | null> => {
  try {
    return (await getCurrentClient(clientId)) ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default function EditClient() {
  const validatedDatas: ClientApiResponse =
    useActionData() as ClientApiResponse;
  const submit = useSubmit();

  // Separate state variable because of datePicker Component
  const [birthdate, setBirthdate] = useState<dayjs.Dayjs | null>(null);
  const [birthdateContainerClassName, setBirthdateContainerClassName] =
    useState<string>("");
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loader, toggleLoader] = useState<boolean>(false);
  const [actionData, setActionData] = useState<ApiResponse | undefined>();
  const [snackbarOpen, toggleSnackbarOpen] = useState<boolean>(false);
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const params = useParams();
  const clientToUpdate: COPEE_APPLI_CLIENT | undefined = useLoaderData() as
    | COPEE_APPLI_CLIENT
    | undefined;
  const isEditMode: boolean = params.client_id ? true : false;
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    register,
    setValue,
    reset,
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: useMemo(() => {
      return {
        firstName: clientToUpdate?.client_first_name,
        lastName: clientToUpdate?.client_last_name,
        email: clientToUpdate?.client_email,
        phone: clientToUpdate?.client_phone,
        fiscalYearIncome: String(clientToUpdate?.client_fiscal_year_income),
        birthdate: clientToUpdate?.client_birthdate,
        phoneFormat: "",
      };
    }, [clientToUpdate]),
  });
  const { field } = useController({
    name: "birthdate",
    control,
    rules: {
      required: "Date de naissance requise",
    },
    defaultValue: birthdate,
  });
  const phoneFormats = [
    { value: "Français", label: "fr" },
    { value: "international", label: "international" },
  ];

  const getPhoneFormatRegex = () => {
    const phoneFormat = watch("phoneFormat");
    if (phoneFormat === "international") {
      return internationalPhoneNumbers_regex;
    }
    return frenchPhoneNumbers_regex;
  };

  const areClientsIdentical = (
    client: COPEE_APPLI_CLIENT,
    client2: COPEE_APPLI_CLIENT
  ) => {
    return compareObjects(client, client2);
  };

  useEffect(() => {
    if (validatedDatas) {
      const apiRes: ApiResponse = {
        message: validatedDatas.message,
        ok: validatedDatas.ok,
        status: validatedDatas.status,
      };
      setActionData(apiRes);
      toggleSnackbarOpen(true);
      toggleLoader(false);
    }

    // Updating client part
    if (clientToUpdate) {
      reset({
        firstName: clientToUpdate?.client_first_name,
        lastName: clientToUpdate?.client_last_name,
        email: clientToUpdate?.client_email,
        phone: clientToUpdate?.client_phone,
        fiscalYearIncome: String(clientToUpdate?.client_fiscal_year_income),
        birthdate: clientToUpdate?.client_birthdate,
        phoneFormat: "",
      });
      setUpdateMode(true);
      toggleLoader(false);
      // setBirthdate(dayjs(clientToUpdate.client_birthdate));
    } else {
      if (updateMode) {
        setUpdateMode(false);
      }
    }
  }, [validatedDatas, clientToUpdate]);

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    toggleSnackbarOpen(false);
  };

  const handlePhoneFormatChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newPhoneFormat = event.target.value as string;
    setValue("phoneFormat", newPhoneFormat);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const dataFormated = {
      birthdate: String(data.birthdate),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      fiscalYearIncome: data.fiscalYearIncome,
    };
    toggleLoader(true);

    const clientUpdated: COPEE_APPLI_CLIENT = {
      client_last_name: data.lastName,
      client_first_name: data.firstName,
      client_email: data.email,
      client_phone: data.phone,
      client_fiscal_year_income: Number(data.fiscalYearIncome),
      client_birthdate: String(data.birthdate),
      client_date_created: clientToUpdate?.client_date_created,
      client_id: clientToUpdate?.client_id,
    };

    if (updateMode) {
      if (
        clientToUpdate &&
        !areClientsIdentical(clientToUpdate, clientUpdated)
      ) {
        submit(dataFormated, {
          method: "put",
          action: `/dashboard/clients/${params.client_id}/edit`,
        });
      } else {
        toggleSnackbarOpen(true);
        const snackBarMessage: ApiResponse = {
          message: "Vous n'avez modifié aucun champ",
          ok: false,
        };
        setActionData(snackBarMessage);
      }
    } else
      submit(dataFormated, {
        method: "post",
        action: `/dashboard/clients/new`,
      });
  };

  const getTitle = () => {
    if (clientToUpdate) {
      return `Client ${clientToUpdate.client_first_name} ${clientToUpdate.client_last_name}`;
    }
    return "Nouveau client";
  };

  const animations = {
    initial: { opacity: 0, x: 1000 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -1000 },
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  return (
    <Container component="main" maxWidth="xs">
      {loader ? <LinearProgress /> : <></>}
      <div>
        {/* <Button
          onClick={handleNavigateBack}
          style={{
            background: "rgb(59, 130, 246, 0.1)",
            height: "25px",
            width: "10px",
          }}
        >
          <ArrowBackIos style={{ height: "10px", width: "10px" }} />
        </Button> */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Suppression du client"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Souhaitez vous réellement supprimer ce client? Attention La
              suppression du client entrainera la suppression de l'installation
              liée à ce dernier!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Non</Button>
            <Button
              onClick={() => {
                toggleLoader(true);
                submit(null, {
                  method: "delete",
                  action: `/clients/${params.client_id}/delete`,
                });
                handleCloseDeleteDialog();
              }}
              autoFocus
            >
              Oui
            </Button>
          </DialogActions>
        </Dialog>
        <motion.div
          variants={animations}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              message={actionData ? actionData.message : ""}
              onClose={handleSnackBarClose}
            >
              <Alert
                onClose={handleSnackBarClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                {actionData ? actionData.message : ""}
              </Alert>
            </Snackbar>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              {clientToUpdate ? <EditIcon /> : <PersonAdd />}
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: "30px" }}
            >
              {getTitle()}
            </Typography>
            <Form method="post" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register("firstName", {
                      required: {
                        value: true,
                        message: "Prénom requis",
                      },
                      minLength: 1,
                      maxLength: 100,
                    })}
                    autoComplete="given-name"
                    name="firstName"
                    autoFocus
                    required
                    fullWidth
                    id="firstName"
                    placeholder={!isEditMode ? "Prénom" : ""}
                    label={isEditMode ? "Prénom" : ""}
                    defaultValue={clientToUpdate?.client_first_name}
                    InputLabelProps={{
                      shrink: clientToUpdate?.client_first_name ? true : false,
                    }}
                  />
                  {errors.firstName && (
                    <Typography className="custom-form-element-error-message">
                      {errors.firstName.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register("lastName", {
                      required: {
                        value: true,
                        message: "Nom requis",
                      },
                      minLength: 1,
                      maxLength: 100,
                    })}
                    required
                    fullWidth
                    id="lastName"
                    name="lastName"
                    placeholder={!isEditMode ? "Nom" : ""}
                    label={isEditMode ? "Nom" : ""}
                    defaultValue={clientToUpdate?.client_last_name}
                    autoComplete="family-name"
                    InputLabelProps={{
                      shrink: clientToUpdate?.client_last_name ? true : false,
                    }}
                  />
                  {errors.lastName && (
                    <Typography className="custom-form-element-error-message">
                      {errors.lastName.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Nom requis",
                      },
                      pattern: {
                        value: email_regex,
                        message: "Adresse invalide",
                      },
                    })}
                    required
                    fullWidth
                    id="email"
                    placeholder={!isEditMode ? "Adresse email" : ""}
                    label={isEditMode ? "Adresse email" : ""}
                    name="email"
                    autoComplete="email"
                    defaultValue={clientToUpdate?.client_email}
                    InputLabelProps={{
                      shrink: clientToUpdate?.client_email ? true : false,
                    }}
                  />
                  {errors.email && (
                    <Typography className="custom-form-element-error-message">
                      {errors.email.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("phoneFormat", {})}
                    id="standard-select-currency-native"
                    select
                    label="Format téléphone"
                    defaultValue="fr"
                    SelectProps={{
                      native: true,
                    }}
                    helperText="Veuillez choisir votre format"
                    variant="standard"
                    onChange={handlePhoneFormatChange}
                  >
                    {phoneFormats.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    {...register("phone", {
                      required: {
                        value: true,
                        message: "Téléphone requis",
                      },
                      pattern: {
                        value: getPhoneFormatRegex(),
                        message: "Téléphone invalide",
                      },
                    })}
                    required
                    fullWidth
                    name="phone"
                    placeholder={!isEditMode ? "Téléphone" : ""}
                    label={isEditMode ? "Téléphone" : ""}
                    type="tel"
                    id="phone"
                    autoComplete="new-telephone"
                    defaultValue={clientToUpdate?.client_phone}
                    InputLabelProps={{
                      shrink: clientToUpdate?.client_phone ? true : false,
                    }}
                  />
                  {errors.phone && (
                    <Typography className="custom-form-element-error-message">
                      {errors.phone.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("fiscalYearIncome", {
                      required: {
                        value: true,
                        message: "Revenu requis",
                      },
                      min: {
                        value: 1,
                        message: "le revenu doit être supérieur à 0",
                      },
                      max: {
                        value: 1000000000,
                        message: "le revenu doit être inférieur à 1000000000",
                      },
                    })}
                    required
                    fullWidth
                    name="fiscalYearIncome"
                    placeholder={
                      !isEditMode ? "Revenu fiscal de référence" : ""
                    }
                    label={isEditMode ? "Revenu fiscal de référence" : ""}
                    type="number"
                    id="fiscal-year-income"
                    autoComplete="new-fiscal-year-income"
                    defaultValue={clientToUpdate?.client_fiscal_year_income}
                    InputLabelProps={{
                      shrink: clientToUpdate?.client_fiscal_year_income
                        ? true
                        : false,
                    }}
                  />
                  {errors.fiscalYearIncome && (
                    <Typography className="custom-form-element-error-message">
                      {errors.fiscalYearIncome.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={8}>
                  <div className={birthdateContainerClassName}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="fr"
                    >
                      <DatePicker
                        label="date de naissance"
                        defaultValue={dayjs("2022-04-17")}
                        value={dayjs(field.value)}
                        onChange={field.onChange}
                        inputRef={field.ref}
                      />
                    </LocalizationProvider>
                    {errors.birthdate && (
                      <Typography className="custom-form-element-error-message">
                        {errors.birthdate.message}
                      </Typography>
                    )}
                  </div>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} style={{ marginTop: "10px" }}>
                <Button type="submit" variant="contained" sx={{ width: "50%" }}>
                  {updateMode ? "Mettre à jour" : "Créer"}
                </Button>
                {updateMode ? (
                  <Button
                    variant="contained"
                    sx={{ width: "50%" }}
                    color="error"
                    onClick={() => {
                      handleClickOpenDeleteDialog();
                    }}
                  >
                    Supprimer
                  </Button>
                ) : (
                  <></>
                )}
              </Stack>
              <Grid container justifyContent="flex-end">
                <Grid item xs={12}></Grid>
              </Grid>
            </Form>
          </Box>

          <Copyright sx={{ mt: 5 }} />
        </motion.div>
      </div>
    </Container>
  );
}
