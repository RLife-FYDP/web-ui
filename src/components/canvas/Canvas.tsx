import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import CanvasDraw from "react-canvas-draw";
import COLORS from "../../commonUtils/colors";

interface CanvasProps {}

interface CanvasState {
  canvasBrushColor: string;
}

// TODO: need to add undo and brush selectors
@observer
export class Canvas extends React.Component<CanvasProps, CanvasState> {
  private canvasRef: CanvasDraw | null = null;

  constructor(props: CanvasProps) {
    super(props);
    this.state = {
      canvasBrushColor: COLORS.DarkGray,
    };
  }

  render() {
    return (
      <Container>
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
        <FixedCanvasDraw
          ref={(ref) => (this.canvasRef = ref)}
          lazyRadius={0}
          brushColor={this.state.canvasBrushColor}
          brushRadius={2}
          onChange={(canvas) => {
            // TODO: do I need debounce? this is the stringified data
            console.log(this.canvasRef?.getSaveData());
          }}
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
})``;

const ColorPickerContainer = styled.div`
  z-index: 100;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translatex(-50%);
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
