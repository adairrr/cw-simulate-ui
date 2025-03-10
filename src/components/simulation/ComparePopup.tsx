import { Grid, Button, Popover, TextField, Typography } from "@mui/material";
import DifferenceOutlinedIcon from "@mui/icons-material/DifferenceOutlined";
import React from "react";
import { useAtom } from "jotai";
import { compareStates } from "../../atoms/compareStates";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";

interface IProps {
  currentActiveState: number;
  executionHistory: any;
}
export const ComparePopup = ({
  currentActiveState,
  executionHistory,
}: IProps) => {
  const [_, setCompareStates] = useAtom(compareStates);
  const [__, setStateResponseTab] = useAtom(stateResponseTabState);
  const [error, setError] = React.useState("");
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleDiffClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDiffClose = () => {
    setAnchorEl(null);
  };
  const getStateString = (stateObj: any) => {
    return window.atob(stateObj?.dict._root.entries[0][1]);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const keyDownHandler = (e: any) => {
    if (e.key == "Enter") {
      const toCompareState = e.target.value;
      if (toCompareState > executionHistory.length || toCompareState < 0) {
        setError("Invalid State");
        return;
      }
      setCompareStates({
        state1: getStateString(executionHistory[currentActiveState].state),
        state2: getStateString(executionHistory[e.target.value - 1].state),
      });
      setStateResponseTab("state");
      setError("");
      e.preventDefault();
    }
  };
  return (
    <Grid>
      <Button aria-describedby={id} onClick={handleDiffClick}>
        <DifferenceOutlinedIcon sx={{ height: "0.8em" }} />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleDiffClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          "& .css-3bmhjh-MuiPaper-root-MuiPopover-paper": {
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 4px 4px",
          },
        }}
      >
        <Grid item sx={{ p: 1 }}>
          <TextField
            id="compare-states"
            label="Compare with State number"
            variant="standard"
            onKeyPress={(e) => keyDownHandler(e)}
          />
        </Grid>
        {error && (
          <Typography variant="subtitle2" color="red" sx={{ p: 1 }}>
            {error}
          </Typography>
        )}
      </Popover>
    </Grid>
  );
};
