import { PAGE_OFFSET, PAGE_LIMIT } from "@/const";
import { Box, Container, TextField } from "@mui/material";
import {
  setPageOffset,
  setPageLimit,
} from "@/components/store/slices/applicationSlice";
import { store } from "@/components/store";

export const Pagination: React.FC = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        alignItems: "center",
        width: "150px",
        height: "10%",
        position: "absolute",
        top: "30%",
        right: "5%",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          mx: "auto",
        }}
      >
        <TextField
          sx={{ marginBottom: "10px" }}
          name="firstName"
          required
          id="pageOffset"
          label={"offset"}
          defaultValue={PAGE_OFFSET}
          type="number"
          onChange={(e) => {
            const pageOffset: number = Number(e.target.value);
            store.dispatch(setPageOffset(pageOffset));
          }}
        />
        <TextField
          name="firstName"
          required
          id="pageLimit"
          label={"nb éléments"}
          type="number"
          defaultValue={PAGE_LIMIT}
          onChange={(e) => {
            const pageLimit = Number(e.target.value);
            store.dispatch(setPageLimit(pageLimit));
          }}
        />
      </Box>
    </Container>
  );
};
