import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Stack, Grid2, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { RequestCreateDocument, DataUser } from '../../../type/nacType';
import { LocalizationProvider, DateTimePicker, renderDigitalClockTimeView, } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface DataFromHeader {
  users: DataUser[],
  createDoc: RequestCreateDocument[],
  setCreateDoc: React.Dispatch<React.SetStateAction<RequestCreateDocument[]>>;
}

export default function Source({ users, createDoc, setCreateDoc }: DataFromHeader) {

  return (
    <Grid2
      container
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
      columnSpacing={2}
      rowSpacing={1}
    >
      <Grid2 size={6}>
        <Stack sx={{ justifyContent: "center", alignItems: "center", }}>
          <Typography variant="body1">
            Department
          </Typography>
          <TextField value={createDoc[0].des_dep_owner ?? ""} variant="standard" sx={{ '& .MuiInputBase-input': { textAlign: 'center', }, }} />
        </Stack>
      </Grid2>
      <Grid2 size={6}>
        <Stack sx={{ justifyContent: "center", alignItems: "center", }}>
          <Typography variant="body1">
            Business Unit
          </Typography>
          <TextField value={createDoc[0].des_bu_owner ?? ""} variant="standard" sx={{ '& .MuiInputBase-input': { textAlign: 'center', }, }} />
        </Stack>
      </Grid2>
      <Grid2 size={12}>
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          value={createDoc[0].des_usercode ?? ""}
          options={users.map((option) => option.UserCode)}
          onChange={(event, newValue) => {
            const dataList = [...createDoc]
            dataList[0].des_usercode = newValue
            dataList[0].desFristName = newValue ? users.find(res => res.UserCode === newValue)?.fristName : ''
            dataList[0].desLastName = newValue ? users.find(res => res.UserCode === newValue)?.lastName : ''
            dataList[0].des_dep_owner = newValue ? users.find(res => res.UserCode === newValue)?.DepCode : ''
            dataList[0].des_bu_owner = newValue ? users.find(res => res.UserCode === newValue)?.BranchID === 901 ? 'Center' : 'Oil' : ''
            setCreateDoc(dataList);
          }}
          renderInput={(params) =>
            <TextField
              {...params}
              variant="standard"
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body1">
                        ผู้รับมอบ :
                      </Typography>
                    </InputAdornment>
                  ),
                },
              }}
            />
          }
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          value={(createDoc[0].desFristName === "undefined" || !createDoc[0].desFristName) ? "" : createDoc[0].desFristName}
          fullWidth
          variant="standard"
          onChange={(event) => {
            const dataList = [...createDoc]
            dataList[0].desFristName = event.target.value
            setCreateDoc(dataList);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="subtitle1">
                    ชื่อจริง :
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          value={(createDoc[0].desLastName === "undefined" || !createDoc[0].desLastName) ? "" : createDoc[0].desLastName}
          fullWidth
          variant="standard"
          onChange={(event) => {
            const dataList = [...createDoc]
            dataList[0].desLastName = event.target.value
            setCreateDoc(dataList);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="subtitle1">
                    นามสกุล :
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid2>
      <Grid2 size={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            name='txtCreateDate'
            formatDensity="spacious"
            format="DD/MM/YYYY HH:mm"
            views={['year', 'month', 'day', 'hours']}
            viewRenderers={{
              hours: renderDigitalClockTimeView,
              seconds: null,
            }}
            closeOnSelect={true}
            sx={{ width: '100%' }}
            slotProps={{
              textField: {
                variant: 'standard', // This applies the 'standard' variant style to the input field
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="subtitle1">
                        วันที่ส่งมอบ :
                      </Typography>
                    </InputAdornment>
                  ),
                },
              },
            }}
            ampm={false}
            value={dayjs(createDoc[0].des_date) ?? ""}
            onChange={(newValue) => {
              if (newValue) {
                const dataList = [...createDoc]
                dataList[0].des_date = newValue;
                setCreateDoc(dataList);
              }
            }}
          />
        </LocalizationProvider>
      </Grid2>
      <Grid2 size={12}>
        <TextField
          value={createDoc[0].des_remark ?? ""}
          fullWidth
          variant="standard"
          onChange={(event) => {
            const dataList = [...createDoc]
            dataList[0].des_remark = event.target.value
            setCreateDoc(dataList);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="subtitle1">
                    หมายเหตุ :
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid2>
    </Grid2>
  );
}