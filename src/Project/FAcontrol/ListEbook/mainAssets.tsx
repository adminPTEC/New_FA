import { GridCellParams, GridColDef } from "@mui/x-data-grid"
import DataTable from "./DataTable"
import React from "react";
import { AssetRecord } from '../../../type/nacType';
import { Stack, Typography, AppBar, Container, Toolbar, Autocomplete, TextField, Box, ImageListItem, CardActionArea, CardContent, ImageList, Pagination, CardMedia } from "@mui/material";
import { dataConfig } from "../../../config";
import Axios from 'axios';
import { Outlet, useNavigate } from "react-router";
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';
import ImageCell from "./ClickOpenImg";
import Loading from "../../../components/Loading";
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(1),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    // boxShadow: `0 2px 10px ${theme.palette.primary.main}33`,
  },
}));


export default function ListNacPage() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const data = localStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;
  const [rows, setRows] = React.useState<AssetRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // State สำหรับการกรองแต่ละฟิลด์
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;
  const [originalRows, setOriginalRows] = React.useState<AssetRecord[]>([]);
  const currentRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const [filter, setFilter] = React.useState<Partial<AssetRecord>>({
    Code: undefined,
    Name: undefined,
    SerialNo: undefined,
    Asset_group: undefined,
    Group_name: undefined,
    BranchID: undefined,
  });

  const searchFilterByKey = (newValue: String | null | undefined, key: keyof AssetRecord, reason: any) => {
    const listFilter = {
      ...filter, [key]: ['', null, undefined].includes(newValue as string | null | undefined) ?
        undefined : newValue,
    }
    const original = originalRows;
    const filteredRows = original.filter(row => {
      return Object.keys(filter).every(key => {
        const fieldKey = key as keyof AssetRecord;
        return listFilter[fieldKey] === undefined || listFilter[fieldKey] === row[fieldKey];
      });
    });
    if (filteredRows.length === 0) {
      setRows(originalRows);
      setFilter(listFilter);
    } else {
      setFilter(listFilter);
      setRows(filteredRows);
    }
  };

  const columns: GridColDef[] = [
    { field: 'Code', headerName: 'รหัสทรัพย์สิน', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'Name', headerName: 'ชื่อทรัพย์สิน', width: 150, headerAlign: 'center' },
    { field: 'SerialNo', headerName: 'SerialNo', headerAlign: 'center', flex: 1 },
    { field: 'OwnerID', headerName: 'ผู้ถือครอง', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'Position', headerName: 'Location NAC', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'Asset_group', headerName: 'Asset Group', headerAlign: 'center', flex: 1 },
    { field: 'Group_name', headerName: 'Group Name', headerAlign: 'center', flex: 1 },
    {
      field: 'Price',
      headerName: 'ราคาทุน',
      width: 100,
      headerAlign: 'center',
      align: 'right',
      renderCell: (params) => params.row.Price ? params.row.Price.toLocaleString('en-US') : 0,
    },
    {
      field: 'CreateDate',
      headerName: 'วันที่ขึ้นทะเบียน',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => dayjs(new Date(params.row.CreateDate)).format('DD/MM/YYYY'),
    },
    {
      field: 'ImagePath',
      headerName: 'รูปภาพ 1',
      headerAlign: 'center',
      align: 'center',
      width: 170,
      renderCell: (params) => (
        <ImageCell imagePath={params.row.ImagePath} name={params.row.Name} code={params.row.Code} />
      ),
    },
    {
      field: 'ImagePath_2',
      headerName: 'รูปภาพ 2',
      headerAlign: 'center',
      align: 'center',
      width: 170,
      renderCell: (params) => (
        <ImageCell imagePath={params.row.ImagePath_2} name={params.row.Name} code={params.row.Code} />
      ),
    },
  ];

  React.useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await Axios.post(
          `${dataConfig.http}/FA_Control_Fetch_Assets`,
          { usercode: parsedData.UserCode },
          dataConfig.headers
        );
        if (response.status === 200) {
          setLoading(false)
          setRows(response.data);
          setOriginalRows(response.data); // Store original data
        } else {
          setLoading(false)
          setRows([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [parsedData.UserCode, pathname]);

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
              value={filter.Code || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'Code', reason)}
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
              value={filter.Name || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'Name', reason)}
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
              value={filter.SerialNo || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'SerialNo', reason)}
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
              value={filter.Asset_group || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'Asset_group', reason)}
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
              value={filter.Group_name || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'Group_name', reason)}
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
              value={filter.Position || ''}
              onChange={(e, newValue, reason) => searchFilterByKey(newValue, 'Position', reason)}
              options={rows ? Array.from(new Set(rows.map(res => res.Position).filter(x => !!x))) : []}
              renderInput={(params) => <TextField {...params} label="Location" />}
            />
          </Grid>
        </Grid>
        {/* <MuiCard variant="outlined" sx={{ width: '100%' }}> */}
        <Grid container spacing={2} sx={{ py: 2, m: 1 }}>
          <Grid display="flex" justifyContent="flex-start" alignItems="flex-start" size={12}>
            <Pagination
              count={Math.ceil(rows.length / itemsPerPage)}
              variant="outlined"
              shape="rounded"
              onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                setCurrentPage(value)
              }}
            />
          </Grid>
          {loading && (
            <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
              <Loading />
            </Grid>
          )}
          {!loading && currentRows.map((res) => (
            <Grid display="flex" key={res.AssetID} justifyContent="center" alignItems="center" size={3}>
              <Card variant="outlined">
                <ImageList sx={{ height: 140, objectFit: 'cover', cursor: 'pointer' }} cols={2}>
                  <div>
                    <ImageCell
                      imagePath={res.ImagePath ?? 'http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_230400022.jpg'}
                      name={'Image 1'}
                      code={res.Code ?? 'unknow'}
                    />
                  </div>
                  <div>
                    <ImageCell
                      imagePath={res.ImagePath_2 ?? 'http://vpnptec.dyndns.org:10280/OPS_Fileupload/ATT_230400022.jpg'}
                      name={'Image '}
                      code={res.Code ?? 'unknow'}
                    />
                  </div>
                </ImageList>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    รหัสทรัพย์สิน: {res.Code}
                  </Typography>
                  <Grid container>
                    <Grid size={12}>
                      <Typography gutterBottom variant="body2">
                        ชื่อทรัพย์สิน: {res.Name}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom variant="body2">
                        ผู้ถือครอง: {res.OwnerID} ({res.Position})
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom variant="body2">
                        SerialNo: {res.SerialNo ?? '-'}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom variant="body2">
                        Asset Group: {res.Asset_group ?? '-'}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom variant="body2">
                        Group Name: {res.Group_name ?? '-'}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom variant="body2">
                        สถานะปัจจุบัน: {res.Details}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography gutterBottom variant="body2" color={res.nac_processing ? 'error' : 'default'}>
                        อื่น ๆ: {res.nac_processing ? `ถูกใช้งานที่ ${res.nac_processing}` : '-'}
                      </Typography>
                    </Grid>
                    {/* nac_processing */}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* </MuiCard> */}
        {/* <DataTable
          rows={renderRows(rows)}
          columns={columns}
          loading={loading}
          isCellEditable={function (params: GridCellParams): boolean {
            throw new Error("Function not implemented.");
          }}
        /> */}
        <Outlet />
      </Container>
    </React.Fragment >
  );
}