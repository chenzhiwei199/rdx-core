---
id: RdxContext
title: RdxContext
---

给 atoms 和 computes 提供上下文环境。这必是所有使用 Rdx hooks 的祖先节点。多个节点可以共存，但如果是嵌套的，那么内部的节点和外部节点中的 atoms 和 computes 是完全隔离的。

---

```jsx
function RdxContext<T>(props: RdxContextProps): React.ReactNode
```

Props:

- context?: React.Context< RdxStore>

  配合 createRdxStateContext 和 createRdxHooks 创建一个新的上下文.

- initializeState?: MapObject< any >;

  一个可选的默认状态，通过这个状态可以对 RdxContext 进行 atoms 和 compute 值的初始化.

- onChange?: (state: MapObject< any >) => void;

  当 RdxContext 中的状态发生变更的时候，会触发改回调

- onLoading?: () => void

  当 RdxContext 中的状态发生变更的时候，会触发该回调

### Example

```jsx
import { RdxContext } from '@alife/rdx';

function AppRoot() {
  return (
    <RdxContext>
      <ComponentThatUsesRdx />
    </RdxContext>
  );
}
```
