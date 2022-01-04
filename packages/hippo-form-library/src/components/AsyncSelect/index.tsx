import * as React from 'react';
import { Select } from '@alife/hippo';
import { debounce } from '@alife/rdx-form';
import { SelectProps } from '@alife/hippo/lib/select';

export interface IAsyncSelectProps extends SelectProps {
  value?: any;
  onChange?: (value: any) => void;
  onSearch: (
    searchKey: string
  ) => Promise<{ label: string; value: string }[]>;
}
export default function AsyncSelct(props: IAsyncSelectProps) {
  const { value, onSearch, dataSource = [], onChange, ...rest } = props;
  const [innerDataSource, setInnerDataSource] = React.useState([] as any);
  return (
    <Select
      {...rest}
      value={value}
      // @ts-ignore
      dataSource={[...innerDataSource, ...dataSource]}
      onChange={(value) => {
        onChange && onChange(value);
      }}
      showSearch
      filterLocal={false}
      onSearch={debounce((value) => {
        onSearch(value).then((res) => {
          setInnerDataSource( res|| []);
        })
        
      }, 100)}
    />
  );
}
