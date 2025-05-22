// theme/DataGridTheme.js
import { AlignHorizontalCenter } from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";
import { blue } from '@mui/material/colors';

export const DataGridTheme = createTheme({
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
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                backgroundColor: blue[100],
                color: 'black',
            },
        },
      },
    },
  },
});
