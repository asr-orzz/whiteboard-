import React, { useContext } from 'react';
import classes from './index.module.css';
import toolItems from '../../constant';
import cx from 'classnames';
import BoardContext from '../../store/board-context';
import { FaDownload } from "react-icons/fa";

const Toolbar = ({download}) => {
  
  const {active_tool,handleActiveTool}=useContext(BoardContext);

  return (
    <div className={classes.ToolbarContainer}>
      {toolItems.map((tool) => {
        const IconComponent = tool.element;
        return (
          <div
            key={tool.item}
            className={cx(classes.Toolbaritem, { [classes.active]: active_tool === tool.item })}
            onClick={() => handleActiveTool(tool.item)}
          >
            <IconComponent />
          </div>
        );
      })}
          <div className={classes.Toolbaritem} onClick={()=>download()}>
            <FaDownload/>
          </div>

    </div>
  );
};

export default Toolbar;
