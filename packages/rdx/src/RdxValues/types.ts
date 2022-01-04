import { RdxState } from "../types/rdxBaseTypes";

export type DataModel<GModel> = GModel | Promise<GModel> | RdxState<GModel>;
