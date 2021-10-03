import React from "react";

import { useForm, Controller } from "react-hook-form";
import Container from "@mui/material/Container";

import Stack from "@mui/material/Stack";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import Autocomplete from "@mui/material/Autocomplete";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";

import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const BEER_TYPES = [
  ...[
    "Life Long Lite Lager",
    "Pursuit Pils",
    "Happy Place Pale Ale",
    "Way of Life IPA",
    "Sunshine City Passionfruit Wheat",
    "All Inclusive Hazy IPA",
    "Big Little Session Pale",
    "Little City Amber Lager",
    "Gambler IPA",
    "Dark Magic Milk Stout",
    "Kinfolk Kolsch",
    "Foolish Hazy IPA",
    "Be Cool",
    "Workshop Pineapple/Lime",
    "Workshop Pink Lemonade",
    "Workshop Peach Ginger",
  ].sort(),
  "Other",
];

const CAN_SIZES = [355, 473];

const KEG_SIZES = [20, 30, 50];

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const App = () => {
  const { control, handleSubmit, watch } = useForm();

  const onSubmit = (data) => console.log(data);

  const beer = watch("beerValue");

  return (
    <Container maxWidth="sm">
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Paper elevation={0} sx={{ m: 5, textAlign: "center" }}>
            Tantalus v1.0
          </Paper>
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <DateInput
                  name="dateValue"
                  control={control}
                  label="Date"
                  size="small"
                />
                <Grid container direction="row" columnSpacing={1}>
                  <Grid item>
                    <Controller
                      name="beerValue"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          size="small"
                          autoSelect
                          options={BEER_TYPES}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField {...params} label="Beer" />
                          )}
                          onChange={(event, value) => onChange(value)}
                        />
                      )}
                    />
                  </Grid>

                  {beer === "Other" ? (
                    <Grid item>
                      <Controller
                        name="otherBeerValue"
                        control={control}
                        defaultValue={""}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            size="small"
                            label="Other Beer Name"
                            variant="outlined"
                            value={value}
                            onChange={(event) => {
                              onChange(event.target.value);
                            }}
                          />
                        )}
                      />
                    </Grid>
                  ) : null}
                </Grid>
                <Divider />
                Inventory
                <KegInput control={control} />
                <FlatInput control={control} />
                <Divider />
                <LitresPanel control={control} />
                <input type="submit" />
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
};

const DateInput = ({ name, control, ...args }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        defaultValue={new Date()}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePicker
            value={value}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} size="small" />}
            {...args}
          />
        )}
      />
    </LocalizationProvider>
  );
};

const KegInput = ({ control }) => {
  return KEG_SIZES.map((keg) => (
    <Grid container spacing={2}>
      <Grid item>{`${keg}L Keg`}</Grid>
      <Grid item>
        <NumericalInput
          name={`${keg}KegQuantity`}
          control={control}
          label="Quantity"
        />
      </Grid>
      <Grid item>Airtable</Grid>
    </Grid>
  ));
};

const FlatInput = ({ control }) => {
  const handleChange = (onChange) => (event) => {
    onChange(event.target.value);
  };
  return (
    <Grid container direction="column" spacing={2}>
      <Grid container>
        <Grid item>Flat</Grid>
        <Grid item>
          <Controller
            name="canSize"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Grid container>
                {CAN_SIZES.map((can) => (
                  <Grid item>
                    <Radio
                      checked={value === can.toString()}
                      onChange={handleChange(onChange)}
                      value={can.toString()}
                      name="radio-buttons"
                      inputProps={{ "aria-label": can.toString() }}
                    />
                    {`${can} mL`}
                  </Grid>
                ))}
              </Grid>
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <NumericalInput
            name="flatQuantity"
            control={control}
            label="Quantity"
          />
        </Grid>
        <Grid item>
          <NumericalInput
            name="lowFill"
            control={control}
            label="Low Filled Cans"
          />
        </Grid>
        <Grid item>
          <NumericalInput
            name="emptyCans"
            control={control}
            label="Empty Cans Lost"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const LitresPanel = ({ control }) => {
  return (
    <Grid container direction="column" spacing={2} justifyContent="center">
      Summary
      <Grid item>
        Starting Volume
        <NumericalInput name="inputVolume" control={control} />
      </Grid>
      <Grid item>Packaged</Grid>
      <Grid item>Remaining</Grid>
      <Grid item>Lost</Grid>
    </Grid>
  );
};

const NumericalInput = ({ name, control, label }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={0}
    render={({ field: { onChange, value } }) => (
      <TextField
        sx={{ maxWidth: 150 }}
        value={value}
        size="small"
        label={label}
        onChange={(event) => {
          onChange(event.target.value === "" ? "" : Number(event.target.value));
        }}
        inputProps={{
          step: 1,
          min: 0,
          type: "number",
        }}
      />
    )}
  />
);
export default App;
