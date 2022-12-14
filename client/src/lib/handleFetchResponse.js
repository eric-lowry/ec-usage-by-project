import createHttpError from "http-errors";

export default function handleFetchResponse(res){
  if (!res.ok) throw createHttpError(res.status,res.statusText);
  return res.json()
};
