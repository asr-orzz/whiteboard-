import React, { useReducer } from 'react';
import BoardContext from './board-context';
import { getSvgPathFromStroke } from '../utils/CreateElement';
import getStroke from 'perfect-freehand';
import { CreateElement } from '../utils/CreateElement';

const initialBoardState = {
    activetool: 'Pencil',
    toolState: 'NONE',
    elements: [],
};

const BoardReducers = (state, action) => {
    switch (action.type) {
        case 'CHANGE_TOOL':
            return {
                ...state,
                activetool: action.payload.tool,
            };
        case 'DROP_DOWN': {
            const { clientX, clientY, toolbox } = action.payload;
            const toolSettings = toolbox[state.activetool] || {};
            const type = {
                type: state.activetool,
                stroke: toolSettings.stroke,
                fill: toolSettings.fill,
                size: toolSettings.size
            };
            const newElement = CreateElement(
                state.elements.length,
                clientX,
                clientY,
                clientX,
                clientY,
                type
            );
            return {
                ...state,
                toolState: state.activetool==="Text"? 'WRITING' : "DRAWING",
                elements: [...state.elements, newElement],
            };
        }
        case 'MOUSE_MOVE': {
            const { clientX, clientY, toolbox } = action.payload;
            const newElements = [...state.elements];
            const index = state.elements.length - 1;
            const { x1, y1 } = newElements[index];
            
            if (state.activetool === "Pencil" ) {
                newElements[index].points = [
                    ...newElements[index].points,
                    { x: clientX, y: clientY }
                ];
                newElements[index].path = new Path2D(
                    getSvgPathFromStroke(getStroke(newElements[index].points))
                );
            } 
            else if(state.activetool==="Eraser"){
              newElements[index].points = [
                ...newElements[index].points,
                { x: clientX, y: clientY }
            ];
            newElements[index].path = new Path2D(
                getSvgPathFromStroke(getStroke(newElements[index].points,{size:50}))
            );
            } 
            else {
                const toolSettings = toolbox[state.activetool] || {};
                const newElement = CreateElement(index, x1, y1, clientX, clientY, {
                    type: state.activetool,
                    stroke: toolSettings.stroke,
                    fill: toolSettings.fill,
                    size: toolSettings.size
                });
                newElements[index] = newElement;
            }
            return {
                ...state,
                elements: newElements
            };
        }
        case 'MOUSE_UP':
            return {
                ...state,
                toolState: 'NONE',
            };
        case "CHANGE_TEXT": {
                const index = state.elements.length - 1;
                const newElements = [...state.elements];
                newElements[index].text = action.payload.text;
                return {
                  ...state,
                  toolState: "NONE",
                  elements: newElements,
                };
        }
        default:
            return state;
    }
};

const BoardContextProvider = ({ children }) => {
    const [BoardState, dispatchBoardActions] = useReducer(BoardReducers, initialBoardState);

    const setActiveTool = (tool) => {
        dispatchBoardActions({
            type: 'CHANGE_TOOL',
            payload: { tool },
        });
    };

    const BoardMouseDownHandler = (event, toolbox) => {
        if(BoardState.toolState==="WRITING") return;

        const { clientX, clientY } = event;

        dispatchBoardActions({
            type: 'DROP_DOWN',
            payload: { clientX, clientY, toolbox },
        });
    };

    const BoardMouseMoveHandler = (event, toolbox) => {
        if(BoardState.toolState==="WRITING") return;
        const { clientX, clientY } = event;
        dispatchBoardActions({
            type: 'MOUSE_MOVE',
            payload: { clientX, clientY, toolbox },
        });
    };

    const BoardMouseUpHandler = () => {
        if(BoardState.toolState==="WRITING") return;
        dispatchBoardActions({
            type: 'MOUSE_UP',
        });
    };

    const textAreaBlurHandler = (text) => {
      dispatchBoardActions({
          type:"CHANGE_TEXT",
          payload: {
            text,
          },
        });
      };

    const BoardContextValue = {
        active_tool: BoardState.activetool,
        toolState: BoardState.toolState,
        elements: BoardState.elements,
        handleActiveTool: setActiveTool,
        BoardMouseDownHandler: BoardMouseDownHandler,
        BoardMouseMoveHandler: BoardMouseMoveHandler,
        BoardMouseUpHandler: BoardMouseUpHandler,
        textAreaBlurHandler: textAreaBlurHandler
    };

    return (
        <BoardContext.Provider value={BoardContextValue}>
            {children}
        </BoardContext.Provider>
    );
};

export default BoardContextProvider;