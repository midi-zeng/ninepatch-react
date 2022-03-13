import React, { useState, useEffect } from 'react';
// import baseCss from './index.scss'
import { NinePatchCore } from 'ninepatch-core';

export default props => {
  const { src, customOptions } = props;
  const [padding, setPadding] = useState({});
  const [borderImageSlice, setBorderImageSlice] = useState({});
  const [clipPath, setClipPath] = useState(0);

  const getNinePatchData = async () => {
    if (src === '' || src === undefined) {
      return false;
    }

    if (customOptions) {
      setPadding(customOptions.padding || {});
      setBorderImageSlice(customOptions.borderImageSlice || {});
      setClipPath(customOptions.clipPath || 0);
    } else {
      const np = new NinePatchCore(src);
      const chunk = await np.getChunkData();
      console.log(chunk);

      setPadding(chunk.padding || {});
      setBorderImageSlice({
        top: chunk.yDivs.start,
        right: chunk.width - chunk.xDivs.stop,
        bottom: chunk.height - chunk.yDivs.stop,
        left: chunk.xDivs.start
      });
      setClipPath(chunk.clipPath || 0);
    }
  };

  useEffect(() => {
    getNinePatchData();
  }, [src, customOptions]);

  const style = {
    height: '100%',
    borderImageSource: `url(${src})`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    borderImageSlice: `${borderImageSlice.top} ${borderImageSlice.right} ${borderImageSlice.bottom} ${borderImageSlice.left} fill`,
    borderImageWidth: `${borderImageSlice.top}px ${borderImageSlice.right}px ${borderImageSlice.bottom}px ${borderImageSlice.left}px`,
    clipPath: `inset(${clipPath}px)`
  };

  return <div style={style}>{props.children}</div>;
};
