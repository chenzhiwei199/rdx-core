import { ActionType,  RdxStore, TargetType , useRdxContext} from '@alife/rdx';
import { enocdeIdByStateType, EFormStateType } from '../components';
import { TStringPathResolver } from '../components/Forms/types';
import { isError } from '../utils/validator';

export interface ISingleErrorMessage {
  id: string;
  msg: string
}
export interface IErrorMessage {
  isError: boolean,
  errorMsg: ISingleErrorMessage | ISingleErrorMessage[],
}
export function createValidator<GSource>(formContext: RdxStore) {
  async function validator(newId: string[]) {
    const allKeys = newId.map((id) => ({
      id,
      value: formContext.getTaskStateById(
        enocdeIdByStateType(id, EFormStateType.EditState)
      ),
    }));
    const allModifyKeys = allKeys.filter((item) => {
      return !item.value.modify;
    });
    // ! 这里是hack方案，有没有办法批量触发
    allModifyKeys.forEach(({ id, value }) => {
      formContext.updateState(
        enocdeIdByStateType(id as string, EFormStateType.EditState),
        ActionType.Update,
        TargetType.TaskState,
        { ...value, modify: true }
      );
    });
    if (allModifyKeys.length > 0) {
      
      const res = formContext.watchOnce(
        newId.map((id) =>
          enocdeIdByStateType(id as string, EFormStateType.Error)
        )
      );
      formContext.batchDepsChangeAtOnce(
        allModifyKeys.map((item) => ({
          key: enocdeIdByStateType(item.id as string, EFormStateType.EditState),
          downStreamOnly: true,
        })), 'form-validate'
      );
      return res
    } else {
      return allKeys.map(item => formContext.getTaskStateById(enocdeIdByStateType(item.id , EFormStateType.Error)));
    }
  }
  return function (id?: TStringPathResolver<GSource> | TStringPathResolver<GSource>[]): Promise<IErrorMessage>  {
    const newId = id as string | string[];
    if (!newId) {
      const allKeys = Array.from<string>(formContext.getTasks().keys())
        .filter((key) =>
          new RegExp(`\^${EFormStateType.EditState}\\$\\$.+`).test(key)
        )
        .map(
          (key) =>
            key.match(new RegExp(`\^${EFormStateType.EditState}\\$\\$(.+)`))[1]
        );
      return validator(allKeys).then((res) => ({
        isError: isError(res),
        errorMsg: allKeys.map((key, index) => ({
          msg: res[index],
          id: key
        })),
      }));
    } else if (Array.isArray(newId)) {
      return validator(newId).then((res) => ({
        isError: isError(res),
        errorMsg:  newId.map((key, index) => ({
          msg: res[index],
          id: key
        })),
      }));
    } else {
      return validator([newId]).then((res) => {
        return {
          isError: isError(res),
          errorMsg: {
            msg: res[0],
            id: newId
          },
        };
      });
    }
  };
}
export function useValidator<GSource>() {
  const formContext = useRdxContext();
  const validator = createValidator<GSource>(formContext);
  return validator;
}
