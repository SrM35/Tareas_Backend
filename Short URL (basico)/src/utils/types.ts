export type ServiceResponse<T = any> = {
  message: string;
  status: number;
  data?: T;
};

export type Service<T = any> = () => Promise<ServiceResponse<T>>;

export type ServiceWithProps<T = any, P = any> = (props: P) => Promise<ServiceResponse<T>>;
