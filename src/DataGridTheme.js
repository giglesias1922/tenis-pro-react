// theme/DataGridTheme.js
import { AlignHorizontalCenter } from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";
import { blue } from '@mui/material/colors';

export const DataGridTheme = {
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center',
          },
        },
        root: {
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'inherit',
          },
          '& .MuiDataGrid-footerContainer': {
            alignItems: 'center',
            minHeight: '52px',
          },
          '& .MuiTablePagination-root': {
            margin: 0,
            overflow: 'visible',
          },
          '& .MuiTablePagination-selectLabel': {
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiTablePagination-displayedRows': {
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiTablePagination-select': {
            marginRight: '8px',
            marginLeft: '8px',
          },
          '& .MuiTablePagination-actions': {
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          },
          '& .MuiTablePagination-toolbar': {
            minHeight: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
          }
        },
      },
    },
  },
};
