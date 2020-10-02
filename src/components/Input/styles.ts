import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div`
  margin-bottom: 15px;
`

export const InputArea = styled.div<ContainerProps>`
  position: relative;

  input {
    width: 100%;
    height: 50px;
    color: #666;
    border-radius: 7px;
    background: white;
    border: 1px solid #aaa;
    outline: 0;
    padding: 0 16px;
    font: 16px Archivo;
    &::placeholder {
      color: #666360;
    }
    &:disabled {
      background: #eee;
    }
    ${(props) =>
      props.isErrored &&
      css`
        border-color: #e02041;
      `}

  }
  &:focus-within::after {
    width: (100% - 32px);
    height: 2px;
    content: "";
    background: #0E3A62;
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 0;
  }
`;

export const Error = styled(Tooltip)`
  color: #e02041;
  font-size: 12px;
  margin-left: 5px;
`;
