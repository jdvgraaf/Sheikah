import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { title } from "process";
import React, { useState } from "react";
import Image from "next/image";
import logo from "./Logo.png";
import { IMaskInput } from "react-imask";
import style from "styled-jsx/style";
import axios from "axios";
import { parsePhoneNumber } from "libphonenumber-js";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        style={{
          fontSize: "126px",
        }}
        {...other}
        mask="(#00) 000-0000"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [sentModalOpen, setSentModalOpen] = useState(false);
  const [sentNumber, setSentNumber] = useState("");

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setPhoneNumber(event.target.value);
  };

  const handleConfirmClick = () => {
    // Regex pattern for validating phone number
    const phoneNumberPattern =
      /^(\+?1\s?)?(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

    if (phoneNumberPattern.test(phoneNumber)) {
      setConfirmModalOpen(true);
    }
  };

  const handleSendClick = () => {

    let phoneNumberObj = parsePhoneNumber(phoneNumber, 'US')
    let inputValue = phoneNumberObj.number

    axios
      .post("/api/sendText", { phoneNumber: inputValue })
      .then((response) => {
        setPhoneNumber("");
        setConfirmModalOpen(false);
        setSentModalOpen(true);
        // Close the sent modal after 10 seconds
        setTimeout(() => {
          setSentModalOpen(false);
        }, 10000);
      })
      .catch((error) => {
        console.log(error)
      });
  };

  const handleCancelClick = () => {
    setConfirmModalOpen(false);
  };

  const handleSentModalClose = () => {
    setSentModalOpen(false);
  };
  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className="h-screen w-full"
      >
        <Grid>
          <Image
            alt={title}
            className="h-96 w-96"
            placeholder="blur"
            src={logo}
          />
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid className="h-60">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              className="h-full w-full"
            >
              <FormControl variant="standard">
                <TextField
                  variant="filled"
                  placeholder="Phone Number"
                  style={{
                    fontSize: "126px",
                    width: "900px",
                  }}
                  value={phoneNumber}
                  onChange={handleInputChange}
                  name="textmask"
                  id="formatted-text-mask-input"
                  InputProps={{
                    inputComponent: TextMaskCustom as any, // we are added the mask component here
                  }}
                  autoComplete="off"
                />
              </FormControl>
            </Box>
          </Grid>
          <Grid>
            <Button
              style={{ width: "700px", height: "200px" }}
              onClick={handleConfirmClick}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={confirmModalOpen}
        onClose={handleCancelClick}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={confirmModalOpen}>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm Phone Number {phoneNumber}
            </Typography>
            <button onClick={handleSendClick}>Send</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={sentModalOpen}
        onClose={handleSentModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={sentModalOpen}>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text sent to {phoneNumber}
            </Typography>
            <button onClick={handleSentModalClose}>Close</button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
