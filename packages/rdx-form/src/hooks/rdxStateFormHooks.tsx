import {
  useGlobalVirtualStateUpdate,
  useRdxContext,
} from '@alife/rdx';
import {
  createTemplateByStateType,
  EFormStateType,
} from '../components/Forms/utils';
export * from '@alife/rdx'
// export const FormRdxStateContext = createRdxStateContext();
// const formRdxHooks = createRdxHooks(FormRdxStateContext);
// export const useRdxFormGlboalState = formRdxHooks.useRdxGlboalState;
// export const useFormGlobalVirtualStateUpdate =
//   formRdxHooks.useGlobalVirtualStateUpdate;
// export const useFormStatusUpdateById = formRdxHooks.useStatusUpdateById;
// export const useRdxFormGlobalContext = formRdxHooks.useRdxGlobalContext;
// export const useGlobalVirtualStateUpdate =
//   formRdxHooks.useGlobalVirtualStateUpdate;
// export const useRdxFormState = formRdxHooks.useRdxState;
// export const useRdxFormValue = formRdxHooks.useRdxValue;
// export const useRdxFormNodeBinding = formRdxHooks.useRdxNodeBinding;
// export const useRdxFormStateLoader = formRdxHooks.useRdxStateLoader;



export function filterStateByRegExp(
  allState: { [key: string]: any },
  reg: RegExp
) {
  return Object.keys(allState).reduce((root, key) => {
    if (reg.test(key)) {
      const newKey = key.replace(reg, '');
      root[newKey] = allState[key];
    }
    return root;
  }, {} as { [key: string]: any });
}

export const useRdxFormErrorState = () => {
  const virtualState = useGlobalVirtualStateUpdate();
  return filterStateByRegExp(
    virtualState,
    new RegExp(createTemplateByStateType(EFormStateType.Error))
  );
};

export const useRdxFormGlobalReset = () => {
  const context = useRdxContext();
  return () => {
    const tasks = context.getTasks();
    let atomTasks = [];
    for (let key of tasks.keys()) {
      if (!tasks.get(key).virtual) {
        atomTasks.push(key);
      }
    }
    context.batchReset(atomTasks);
  };
};
