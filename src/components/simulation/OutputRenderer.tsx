import React from "react";
import { OutputCard } from "./OutputCard";

interface IProps {
  response: JSON | undefined;
}

export const OutputRenderer = ({ response }: IProps) => {
  return (
    <OutputCard
      response={response}
      placeholder="Your step response will appear here."
    />
  );
};
