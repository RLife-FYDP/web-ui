import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import CanvasDraw from "react-canvas-draw";
import COLORS from "../../commonUtils/colors";

import { ReactComponent as UndoIcon } from "../../icons/Undo.svg";
import { ReactComponent as SaveIcon } from "../../icons/SaveIcon.svg";
import { observable } from "mobx";
import { CanvasViewState } from "./CanvasViewState";
import { Loading } from "../common/Loading";

interface CanvasProps {}

interface CanvasState {
  canvasBrushColor: string;
}

@observer
export class Canvas extends React.Component<CanvasProps, CanvasState> {
  @observable viewState = new CanvasViewState();

  // used for accessing saved canvas drawing
  private canvasRef: CanvasDraw | null = null;

  constructor(props: CanvasProps) {
    super(props);
    this.state = {
      canvasBrushColor: COLORS.DarkGray,
    };
  }

  render() {
    return this.viewState.isLoading ? (
      <Loading />
    ) : (
      <Container>
        <ToolSelectionContainer>
          <ColorPickerContainer>
            {Object.keys(COLORS).map((key) => {
              const colorCode = COLORS[key as keyof typeof COLORS];
              return (
                <ColorPalette
                  key={colorCode}
                  color={colorCode}
                  onClick={() => {
                    this.setState({
                      canvasBrushColor: colorCode,
                    });
                  }}
                />
              );
            })}
          </ColorPickerContainer>
          <CurrentlySelectedContainer>
            <CurrentBrush selectedColor={this.state.canvasBrushColor} />
            <StyledUndoIcon
              onClick={() => {
                this.canvasRef?.undo();
              }}
            />
            <StyledSaveIcon
              onClick={() => {
                const data = this.canvasRef?.getSaveData();
                if (!data) {
                  return;
                }
                this.viewState.updateCanvasToServer(data);
              }}
            />
          </CurrentlySelectedContainer>
        </ToolSelectionContainer>
        <FixedCanvasDraw
          ref={(ref) => {
            this.canvasRef = ref;
          }}
          lazyRadius={0}
          brushColor={this.state.canvasBrushColor}
          brushRadius={2}
          loadTimeOffset={0}
          saveData={this.viewState.canvasData}
        />
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  height: calc(100% - 8px);
  width: calc(100% - 16px);
  margin: 4px 8px;
  overflow: hidden;
  border: 1px solid ${COLORS.Graphite};
`;

const FixedCanvasDraw = styled(CanvasDraw).attrs({
  enablePanAndZoom: true,
  canvasWidth: 800,
  canvasHeight: 800,
})``;

const ColorPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  border-radius: 5px;
  border: 1px solid ${COLORS.Black};
  overflow: hidden;
  cursor: pointer;
`;

const ColorPalette = styled.div<{
  color: string;
}>`
  width: 30px;
  height: 30px;
  background: ${({ color }) => color};
`;

const ToolSelectionContainer = styled.div`
  z-index: 100;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const CurrentlySelectedContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 8px;
`;

const CurrentBrush = styled.div<{
  selectedColor: string;
}>`
  width: 30px;
  height: 30px;
  margin-right: 4px;
  border-radius: 50%;
  border: 1px solid ${COLORS.Black};
  background: ${({ selectedColor }) => selectedColor};
`;

const StyledUndoIcon = styled(UndoIcon)`
  margin: 0 4px;
`;

const StyledSaveIcon = styled(SaveIcon)`
  margin: 0 4px;
`;
