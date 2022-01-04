import { useMemo, useRef } from 'react';
import * as React from 'react';
import Clipboard from 'react-clipboard.js';
import {
  compute,
  RdxContext,
  useRdxValue,
  atom,
  useRdxState,
} from '@alife/rdx';
import { Input } from '@alife/hippo';

export default {
  title: '场景专题',
  parameters: {
    info: { inline: true },
  },
};
const urlAtom = atom({
  id: 'url',
  defaultValue: '',
});

const parseValue = compute({
  id: 'params',
  get: ({ get }) => {
    const url = get(urlAtom);
    const urlInstance = new URL(url);
    let params = {} as { [key: string]: string };
    urlInstance.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },
});
const UrlInput = () => {
  const [url, setUrl] = useRdxState(urlAtom);
  return (
    <div style={{ display: 'flex' }}>
      <strong style={{ minWidth: 100 }}>请输入链接</strong>
      <Input.TextArea
        style={{ width: 300 }}
        value={url}
        onChange={(value) => setUrl(value)}
      />
    </div>
  );
};
const JsonPreview = () => {
  const value = useRdxValue(parseValue);
  return (
    <div style={{ display: 'flex', width: '100%', marginTop: 12 }}>
      <strong style={{ minWidth: 100 }}>预览</strong>
      <div style={{ maxWidth: 'calc(100% - 100px)', position: 'relative' }}>
        <Clipboard
          data-clipboard-text={JSON.stringify(value, null, 2)}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            cursor: 'pointer',
            background: '#23a3ff33',
            borderRadius: 4,
          }}
        >
          copy
        </Clipboard>
        <pre style={{ minWidth: 200, minHeight: 100 }}>
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  );
};
export const 简单搜索列表 = () => {
  return (
    <RdxContext>
      <UrlInput></UrlInput>
      <JsonPreview></JsonPreview>
    </RdxContext>
  );
};
