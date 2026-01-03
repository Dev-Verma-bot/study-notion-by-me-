import React from 'react'
import {toast} from "react-hot-toast"
import { ApiConnect } from '../ApiConnect'
import { catalogData } from '../Apis'
export const getCatalogaPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
        const response = await ApiConnect("POST", catalogData.CATALOGPAGEDATA_API, 
        {categoryId: categoryId,});
                  if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

         result = response?.data;

  }
  catch(error) {
        toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}