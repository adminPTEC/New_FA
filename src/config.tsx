const httpPTEC_TEST = 'http://similan:33052/api' //main
const httpLandOffice = 'http://10.20.100.29:33052/api' //TEST
const httpHome = 'http://172.16.3.143:33052/api' //Home
const wifioffice = 'http://10.20.105.104:33052/api'

interface DataConfig {
  http: string;
  headers: {
    [key: string]: string;
  };
  headerUploadFile: {
    [key: string]: string;
  };
}

export const dataConfig: DataConfig = {
  headers: {
    'Content-Type': `application/json; charset=utf-8`,
    'Accept': 'application/json'
  },
  headerUploadFile: {
    'Content-Type': `multipart/form-data`,
    'Accept': 'application/json'
  },
  http: httpPTEC_TEST
}