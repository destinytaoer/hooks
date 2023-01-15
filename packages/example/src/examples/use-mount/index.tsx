import { FC } from 'react';
import { useMount } from 'hooks';

interface IIndexProps {}

const Index: FC<IIndexProps> = (props) => {
  useMount(() => {
    console.log('mount');
    return () => {
      console.log('unmount');
    };
  });
  return (
    <div>
      <h2>use-mount</h2>
    </div>
  );
};

export default Index;
