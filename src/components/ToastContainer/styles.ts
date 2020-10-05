import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 30px;
  overflow: hidden;
  z-index: 9999;

  @media (max-width: 800px) {
    margin: 10px;
  }
`;
