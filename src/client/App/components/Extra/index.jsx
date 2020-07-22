import React, {
  useCallback, useEffect, useRef, useState
} from 'react';

export default function Extra({
  children,
  name: {
    name: TestName,
  }
}) {
  const [name] = useState(`${TestName} Test`);
  return (
    <div>
      {children}
      {name}
    </div>
  );
}
