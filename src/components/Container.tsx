import React from 'react';

interface PropsI {
  className?: string | undefined;
  children: React.ReactNode;
}

const Container: React.FC<PropsI> = (props) => (
  <div
    className={`container pt-4 pb-8 px-8 mx-auto xl:px-8 ${
      props.className != null ? props.className : ''
    }`}
  >
    {props.children}
  </div>
);

export default Container;
