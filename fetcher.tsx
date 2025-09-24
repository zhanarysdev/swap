import {
  collection,
  getDocs,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

// async function resolveDocumentReferences(data: any): Promise<any> {
//   const resolvedData: Record<string, any> = { ...data };

//   for (const key in resolvedData) {
//     const value = resolvedData[key];

//     // Check if it's a DocumentReference and resolve its data
//     if (value instanceof DocumentReference) {
//       const path = value.path;
//       console.log(`Resolving reference at path: ${path}`);

//       const refDocSnap = await getDoc(value);
//       if (refDocSnap.exists()) {
//         resolvedData[key] = {
//           id: refDocSnap.id,
//           ...refDocSnap.data(),
//         };
//       } else {
//         resolvedData[key] = { path, message: "Document does not exist" };
//       }
//     }
//   }

//   return resolvedData;
// }

// export const fetcher = async (collection_name: string) => {
//   const url = collection_name.split("/");
//   let colRef;
//   if (url.length > 1) {
//     colRef = collection(db, url[0]);
//   } else {
//     colRef = collection(db, url[0]);
//   }

//   const snapshot = await getDocs(colRef);

//   const formattedDocs = await Promise.all(
//     snapshot.docs.map(async (doc) => {
//       const data = doc.data();
//       const resolvedData = await resolveDocumentReferences(data);
//       return { id: doc.id, ...resolvedData };
//     })
//   );

//   return formattedDocs;
// };
let token;
if (typeof window !== "undefined") {
  token = localStorage?.getItem("token");
}

export const fetcher = async ({
  url,
  custom,
}: {
  url: string;
  custom: boolean;
}) => {
  const res: any = fetch(
    custom
      ? `https://admin.swapp.kz/api/${url}`
      : `https://admin.swapp.kz/api/v1/${url}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        SuperToken: token,
      },
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
  return res;
};
export const post = async ({ url, data, custom = false }) => {
  const res = fetch(
    custom
      ? `https://admin.swapp.kz/api/${url}`
      : `https://admin.swapp.kz/api/v1/${url}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        SuperToken: token,
      },
      body: JSON.stringify(data),
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
  return res;
};
export const postFile = async ({ url, data, custom = false }) => {
  const res = fetch(
    custom
      ? `https://admin.swapp.kz/api/${url}`
      : `https://admin.swapp.kz/api/v1/${url}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        SuperToken: token,
      },
      body: (data),
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
  return res;
};

export const editFile = async ({ url, data, custom = false }) => {
  const res = fetch(
    custom
      ? `https://admin.swapp.kz/api/${url}`
      : `https://admin.swapp.kz/api/v1/${url}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        SuperToken: token,
      },
      body: (data),
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
  return res;
};

export const edit = async ({ url, data, custom = false }) => {
  const res = fetch(
    custom
      ? `https://admin.swapp.kz/api/${url}`
      : `https://admin.swapp.kz/api/v1/${url}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        SuperToken: token,
      },
      body: JSON.stringify(data),
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
  return res;
};

export const remove = async ({
  url,
  custom,
}: {
  url: string;
  custom?: boolean;
}) => {
  const res = fetch(
    custom
      ? `https://admin.swapp.kz/api/${url}`
      : `https://admin.swapp.kz/api/v1/${url}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        SuperToken: token,
      },
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
  return res;
};
