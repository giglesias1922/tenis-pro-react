// theme/DataGridTheme.js
import { AlignHorizontalCenter } from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";

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
                backgroundColor: '#bee9e8',
                color: 'black',
            },
        },
      },
    },
  },
});
