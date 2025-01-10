import { GridActionsCellItem, GridCellParams, GridColDef } from "@mui/x-data-grid"
import DataTable from "./DataTable"
import React from "react";
import { AssetRecord, UpdateDtlAssetParams, DataUser } from '../../../type/nacType';
import { Typography, AppBar, Container, Toolbar, Autocomplete, TextField, Box, Dialog, styled, Button, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Card } from "@mui/material";
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { dataConfig } from "../../../config";
import Axios from 'axios';
import { Outlet, useNavigate } from "react-router";
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ListNacPage() {
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [rows, setRows] = React.useState<AssetRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [rowEdit, setRowEdit] = React.useState<Partial<UpdateDtlAssetParams>>({});
  const [users, setUsers] = React.useState<DataUser[]>([]);
  const [permission_menuID, setPermission_menuID] = React.useState<number[]>([]);


  const handleClickOpen = (params: AssetRecord) => {
    const updatedRow = {
      Code: params.Code ?? '',
      Name: params.Name ?? '',
      Asset_group: params.Asset_group ?? '',
      Group_name: params.Group_name ?? '',
      BranchID: typeof params.BranchID === 'string' || typeof params.BranchID === 'number' ? params.BranchID : '',
      OwnerCode: params.OwnerID ?? '',
      Details: params.Details ?? '',
      SerialNo: params.SerialNo ?? '',
      Price: typeof params.Price === 'string' || typeof params.Price === 'number' ? params.Price : '',
      Position: params.Position ?? '',
      UserCode: typeof parsedData.UserCode === 'string' ? parsedData.UserCode : '', // Ensure UserCode is a string
    };

    setRowEdit(updatedRow as Partial<UpdateDtlAssetParams>);  // Cast updatedRow to Partial<UpdateDtlAssetParams>
    setOpenDialogEdit(true);
  };

  const handleClose = () => {
    setOpenDialogEdit(false);
  }

  const handleCloseSaved = async () => {
    setOpenDialogEdit(false);
    try {
      const response = await Axios.post(
        `${dataConfig.http}/UpdateDtlAsset`,
        rowEdit,
        dataConfig.headers
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "อัปเดตรายการสำเร็จ",
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      Swal.fire({
        icon: "success",
        title: `อัปเดตรายการสำเร็จ`,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  // State สำหรับการกรองแต่ละฟิลด์
  const [filterRows, setFilterRows] = React.useState<Partial<AssetRecord>>({
    Code: undefined,
    Name: undefined,
    SerialNo: undefined,
    Asset_group: undefined,
    Group_name: undefined,
    BranchID: undefined,
  });

  // ฟังก์ชันในการกรองข้อมูลเมื่อมีการเปลี่ยนแปลงฟิลเตอร์
  function renderRows(rows: AssetRecord[]) {
    const lengthRows: number = rows.filter(res =>
      filterRows.Code === res.Code ||
      filterRows.Name === res.Name ||
      filterRows.SerialNo === res.SerialNo ||
      filterRows.Asset_group === res.Asset_group ||
      filterRows.Group_name === res.Group_name ||
      filterRows.Position === res.Position
    ).length
    if (lengthRows > 0) {
      return rows.filter(res =>
        filterRows.Code === res.Code ||
        filterRows.Name === res.Name ||
        filterRows.SerialNo === res.SerialNo ||
        filterRows.Asset_group === res.Asset_group ||
        filterRows.Group_name === res.Group_name ||
        filterRows.Position === res.Position
      )
    } else {
      return rows
    }
  }

  const handleChangeFilterNAC = (newValue: string | number, id: string) => {
    setFilterRows(prev => ({ ...prev, [id]: newValue }));
  };

  const columns: GridColDef[] = [
    { field: 'Code', headerName: 'รหัสทรัพย์สิน', width: 140, headerAlign: 'center', align: 'center', },
    { field: 'Name', headerName: 'ชื่อทรัพย์สิน', width: 250, headerAlign: 'center' },
    { field: 'SerialNo', headerName: 'SerialNo', headerAlign: 'center', width: 140, },
    { field: 'OwnerID', headerName: 'ผู้ถือครอง', width: 100, headerAlign: 'center', align: 'center', },
    { field: 'Position', headerName: 'Location NAC', width: 140, headerAlign: 'center', align: 'center', },
    { field: 'Asset_group', headerName: 'Asset Group', headerAlign: 'center', align: 'center', width: 140, },
    { field: 'Group_name', headerName: 'Group Name', headerAlign: 'center', align: 'left', width: 140, },
    { field: 'Details', headerName: 'รายละเอียด', headerAlign: 'center', flex: 1, },
    {
      field: 'Price', headerName: 'ราคาทุน', width: 120, headerAlign: 'center', align: 'right',
      renderCell: (params) => params.row.Price ? params.row.Price.toLocaleString('en-US') : 0,
    },
    {
      field: 'CreateDate', headerName: 'วันที่ขึ้นทะเบียน', width: 120, headerAlign: 'center', align: 'center',
      renderCell: (params) => dayjs(new Date(params.row.CreateDate)).format('DD/MM/YYYY'),
    },
    {
      field: 'Actions', type: 'actions', headerName: 'actions', width: 80, headerAlign: 'center', align: 'center',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<SaveAsIcon />}
            label="Edit Row"
            disabled={!permission_menuID.includes(5)}
            onClick={() => handleClickOpen(params.row)}
            color="warning"
          />,
        ];
      },

    },
  ];

  React.useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        // Permission
        await Axios.post(dataConfig.http + '/select_Permission_Menu_NAC', { Permission_TypeID: 1, userID: parsedData.userid }, dataConfig.headers)
          .then(async responsePermission => {
            setPermission_menuID(responsePermission.data.data.map((res: { Permission_MenuID: number; }) => res.Permission_MenuID))
            // แสดง users ทั้งหมด
            await Axios.get(dataConfig.http + '/getsUserForAssetsControl', dataConfig.headers)
              .then((res) => {
                setUsers(res.data.data)
              })

            const response = await Axios.post(
              `${dataConfig.http}/FA_Control_Fetch_Assets`,
              { usercode: parsedData.UserCode },
              dataConfig.headers
            );
            if (response.status === 200) {
              const permis = responsePermission.data.data.map((res: { Permission_MenuID: number; }) => res.Permission_MenuID)
              const dataLog = permis.includes(5)
                ? response.data.filter((res: AssetRecord) => res.Code && !res.Code.startsWith("BP"))
                : response.data.filter((res: AssetRecord) => res.Code && (res.OwnerID === parsedData.UserCode && !res.Code.startsWith("BP")))
              setLoading(false)
              setRows(dataLog);
            } else {
              setLoading(false)
              setRows([]);
            }
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [parsedData.UserCode, parsedData.userid]);

  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="subtitle1" color="inherit">
            ทะเบียนทรัพย์สินทั้งหมด
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ my: 2 }} maxWidth="xl">
        <Grid container spacing={2} sx={{ py: 1 }}>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Code || ''}
              onChange={(e, newValue) => handleChangeFilterNAC(newValue ?? '', 'Code')}
              options={rows ? Array.from(new Set(rows.map(res => res.Code).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Code" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Name || ''}
              onChange={(e, newValue) => handleChangeFilterNAC(newValue ?? '', 'Name')}
              options={rows ? Array.from(new Set(rows.map(res => res.Name).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Name" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.SerialNo || ''}
              onChange={(e, newValue) => handleChangeFilterNAC(newValue ?? '', 'SerialNo')}
              options={rows ? Array.from(new Set(rows.map(res => res.SerialNo).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="SerialNo" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Asset_group || ''}
              onChange={(e, newValue) => handleChangeFilterNAC(newValue ?? '', 'Asset_group')}
              options={rows ? Array.from(new Set(rows.map(res => res.Asset_group).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Asset_group" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Group_name || ''}
              onChange={(e, newValue) => handleChangeFilterNAC(newValue ?? '', 'Group_name')}
              options={rows ? Array.from(new Set(rows.map(res => res.Group_name).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Group_name" />}
            />
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Autocomplete
              autoHighlight
              disablePortal
              id="autocomplete-status-name"
              size="small"
              sx={{ flexGrow: 1, padding: 1 }}
              value={filterRows.Position || ''}
              onChange={(e, newValue) => handleChangeFilterNAC(newValue ?? '', 'Position')}
              options={rows ? Array.from(new Set(rows.map(res => res.Position).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Location" />}
            />
          </Grid>
        </Grid>
        <Grid justifyContent="center" alignItems="center" size={12}>
          <Card variant="outlined">
            <DataTable
              rows={renderRows(rows)}
              columns={columns}
              loading={loading}
              users={users}
              isCellEditable={function (params: GridCellParams): boolean {
                throw new Error("Function not implemented.");
              }}
            />
          </Card>
        </Grid>
        <Outlet />
      </Container>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialogEdit}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          รหัสทรัพย์สิน {rowEdit?.Code}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <TextField
                id="outlined-textarea"
                size="small"
                multiline
                fullWidth
                value={rowEdit?.Name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (rowEdit) {
                    const updatedRow =
                    {
                      ...rowEdit,
                      Code: rowEdit?.Code,
                      Name: e.target.value,
                    }
                    setRowEdit(updatedRow)
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="subtitle1">
                          Nmae :
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <TextField
                id="outlined-textarea"
                size="small"
                multiline
                fullWidth
                value={rowEdit?.SerialNo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (rowEdit) {
                    const updatedRow =
                    {
                      ...rowEdit,
                      Code: rowEdit?.Code,
                      SerialNo: e.target.value,
                    }
                    setRowEdit(updatedRow)
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="subtitle1">
                          SerialNo :
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <TextField
                id="outlined-textarea"
                size="small"
                multiline
                fullWidth
                value={rowEdit?.Asset_group}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (rowEdit) {
                    const updatedRow =
                    {
                      ...rowEdit,
                      Code: rowEdit?.Code,
                      Asset_group: e.target.value,
                    }
                    setRowEdit(updatedRow)
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="subtitle1">
                          Asset group :
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <TextField
                id="outlined-textarea"
                size="small"
                multiline
                fullWidth
                value={rowEdit?.Group_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (rowEdit) {
                    const updatedRow =
                    {
                      ...rowEdit,
                      Code: rowEdit?.Code,
                      Group_name: e.target.value,
                    }
                    setRowEdit(updatedRow)
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="subtitle1">
                          Group name :
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                options={users.map((option) => option.UserCode)}
                sx={{ width: '100%' }}
                onChange={(e, newValue) => {
                  if (rowEdit) {
                    const updatedRow =
                    {
                      ...rowEdit,
                      Code: rowEdit?.Code,
                      OwnerCode: newValue,
                    }
                    setRowEdit(updatedRow)
                  }
                }}
                value={String(rowEdit?.OwnerCode) || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography variant="body1">
                              ผู้ถือครอง :
                            </Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <TextField
                id="outlined-textarea"
                size="small"
                multiline
                fullWidth
                value={rowEdit?.Position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (rowEdit) {
                    const updatedRow =
                    {
                      ...rowEdit,
                      Code: rowEdit?.Code,
                      Position: e.target.value,
                    }
                    setRowEdit(updatedRow)
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="subtitle1">
                          Position :
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <TextField
                id="outlined-textarea"
                placeholder="Details"
                size="small"
                multiline
                fullWidth
                rows={4}
                value={rowEdit?.Details}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (rowEdit) {
                    const updatedRow =
                    {
                      ...rowEdit,
                      Code: rowEdit?.Code,
                      Details: e.target.value,
                    }
                    setRowEdit(updatedRow)
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="success"
            onClick={handleCloseSaved}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment >
  );
}