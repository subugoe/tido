import React, { useEffect } from "react";
const CustomHTML = ({ textHtml }) => {
  const ref = React.useRef();

  useEffect(() => (ref.current.outerHTML = textHtml), []);

  return <div ref={ref} />;
};
export default CustomHTML;
