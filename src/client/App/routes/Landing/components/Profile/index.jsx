import React, {
  useContext, useEffect, useState, useMemo, useCallback
} from 'react';
import { Button } from '@material-ui/core';
import Context from '../../../../UserContext';
import Table from './components/Table';
import { apiRoutes } from '../../../../../../const/routes';
import { handleFetch } from '../../../../../../helpers';

async function fetchData({
  start, end
}) {
  try {
    const data = (await handleFetch(`/api${apiRoutes.data}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start,
        end,
      }),
    })).json();
    return data;
  } catch (e) {
    return [];
  }
}

function updateEntry(data) {
  handleFetch(`/api${apiRoutes.update}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export default function Profile() {
  const { addHandler } = useContext(Context);
  const [data, setData] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const objectMutable = useMemo(() => ({
    counter: 0,
  }), []);
  const randomId = useMemo(
    () => (start + Math.floor(Math.random() * (end - start))), [start, end, data]
  );

  const handleDocChange = useCallback((data) => {
    console.log(data);
  }, []);

  useEffect(() => {
    fetchData({
      start,
      end,
    }).then(setData);
    addHandler(handleDocChange);
  }, []);

  return (
    <>
      <Button onClick={() => {
        updateEntry({
          id: randomId,
          text: objectMutable.counter,
        });
        objectMutable.counter += 1;
      }}
      >
        Update random
        {randomId}
      </Button>
      <Table data={data} />
    </>
  );
}
