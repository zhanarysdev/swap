// "use client";
// import { Header } from "@/components/header/header";
// import { FieldError } from "@/components/input/field-error";
// import { Input } from "@/components/input/input";
// import { Label } from "@/components/input/label";
// import { Modal } from "@/components/modal/modal";
// import { ModalDelete } from "@/components/modal/modal-delete";
// import { Table } from "@/components/table/table";
// import { fetcher } from "@/fetcher";
// import { useState } from "react";
// import { createPortal } from "react-dom";
// import useSWR from "swr";

// const url = "https://ninety-beans-jog.loca.lt";

// export default function ClothePage() {
//   const [isOpen, setOpen] = useState(false);
//   const [value, setValue] = useState("");
//   const [isEdit, setEdit] = useState<null | string>(null);
//   const [isDelete, setDelete] = useState<null | string>(null);
//   const [valueError, setValueError] = useState<undefined | string>(undefined);
//   const { data, isLoading, mutate } = useSWR(`${url}/clothe`, fetcher);
//   const remove = async () => {
//     const res = await fetch(`${url}/clothe/${isDelete}`, {
//       method: "DELETE",
//     });

//     if (res.ok) {
//       setDelete(null);
//       mutate();
//     }
//   };

//   const save = async () => {
//     if (!value) {
//       return setValueError("Обязательное поле");
//     } else {
//       setValueError(undefined);
//     }
//     if (isEdit) {
//       const res = await fetch(`${url}/clothe/${isEdit}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: value,
//         }),
//       });
//       if (res.ok) {
//         setEdit(null);
//         setOpen(false);
//         mutate();
//       }
//     } else {
//       const res = await fetch(`${url}/clothe`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: value,
//         }),
//       });
//       if (res.ok) {
//         setOpen(false);
//         mutate();
//       }
//     }
//     setValue("");
//   };
//   const edit = async (id: string) => {
//     setEdit(id);
//     setValue(data.find((el: any) => el.id === id).name);
//     setOpen(true);
//   };

//   if (isLoading) return <div>...loading</div>;

//   return (
//     <div>
//       <Header title={"Одежда"} subTitle={""} />
//       <Table
//         data={data}
//         labels={labels}
//         onDelete={(id) => setDelete(id)}
//         onEdit={edit}
//         control={{
//           label: "Добавить",
//           action: () => {
//             setOpen(true);
//           },
//         }}
//       />
//       {isOpen &&
//         createPortal(
//           <Modal
//             close={() => {
//               setValue("");
//               setOpen(false);
//             }}
//             onSave={save}
//             label={isEdit ? "Редактировать" : "Добавить"}
//           >
//             <div className="flex flex-col gap-2">
//               <Label label={"Название одежды"} />
//               <Input
//                 placeholder="Название"
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//               />
//               <FieldError error={valueError} />
//             </div>
//           </Modal>,
//           document.getElementById("page-wrapper") as any
//         )}
//       {isDelete &&
//         createPortal(
//           <ModalDelete
//             close={() => {
//               setDelete(null);
//             }}
//             onDelete={remove}
//             label="Вы точно хотите удалить этот город?"
//           />,
//           document.getElementById("page-wrapper") as any
//         )}
//     </div>
//   );
// }

"use client";

import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { FieldError } from "@/components/input/field-error";
import { Input } from "@/components/input/input";
import { ModalDelete } from "@/components/modal/modal-delete";
import { ModalSave } from "@/components/modal/modal-save";
import Table from "@/components/temp/table";
import {
  default_context,
  TableContext,
} from "@/components/temp/table-provider";
import { edit, fetcher, post, remove } from "@/fetcher";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Название",
  },
];

const schema = yup
  .object({
    name: yup.string().required("Oбязательное поле"),
  })
  .required();
type FormSchemaType = yup.InferType<typeof schema>;

export default function CitiesPage() {
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState<null | string>(null);
  const [isEdit, setEdit] = useState<null | string>(null);
  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `clothes/list?search=${debouncedSearch}&sortBy=${context.sortValue}`,
    },
    fetcher
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchemaType>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result,
        labels: labels,
        control: {
          action: () => setOpen(true),
          label: "Добавить",
        },
        onDelete: (id) => setDelete(id),
        onEdit: (id) => {
          setValue("name", data.result.find((el) => el.id === id)?.name as any);
          setOpen(true);
          setEdit(id);
        },
      }));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);

  async function save(data: FormSchemaType) {
    const res = await post({
      url: `clothes/create`,
      data: { name: data.name, company_count: 0, influencer_count: 0 },
    });
    if (res.statusCode === 200) {
      reset();
      setOpen(false);
      mutate();
    }
  }

  async function onEdit(data: FormSchemaType) {
    const res = await edit({
      url: "clothes/edit",
      data: { id: isEdit, name: data.name },
    }); // Specify the collection and document ID
    if (res.statusCode === 200) {
      reset();
      setEdit(null);
      setOpen(false);
      mutate();
    }
  }

  async function onRemove() {
    const res = await remove(`clothes/${isDelete}` as any);
    setDelete(null);
    mutate();
  }

  return (
    <div>
      <Header title={"Одежда"} subTitle={""} />
      <Table />

      {isOpen &&
        createPortal(
          <ModalSave
            key={isEdit ? "edit-modal" : "add-modal"}
            onSave={handleSubmit(isEdit ? onEdit : save)}
            label={isEdit ? "Изменить" : "Добавить"}
            close={() => {
              setOpen(false);
              setEdit(null);
              reset({ name: "" });
            }}
          >
            <div className="flex flex-col gap-8">
              <div>
                <Input
                  placeholder="Название"
                  name="name"
                  {...register("name")}
                />
                <FieldError error={errors.name?.message} />
              </div>
            </div>
          </ModalSave>,
          document.getElementById("page-wrapper")
        )}

      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить"}
            close={() => setDelete(null)}
            onDelete={onRemove}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
