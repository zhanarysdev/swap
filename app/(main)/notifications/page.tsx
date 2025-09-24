"use client";
import { useDebounce } from "@/components/debuncer";
import { Header } from "@/components/header/header";
import { ModalDelete } from "@/components/modal/modal-delete";
import { default_context, TableContext } from "@/components/temp/table-provider";
import { fetcher } from "@/fetcher";
import Table from '@/components/temp/table'
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import { ButtonBG } from "@/components/button/button";

const labels = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "title",
    title: "Заголовок",
  },
  {
    key: "message",
    title: "Текст",
  },
  {
    key: "filter",
    title: "Фильтр",
  },
  {
    key: "link",
    title: "Ссылка",
  },
  {
    key: "created_at",
    title: "Время",
    date: true,
  },
  {
    key: "recipient_count",
    title: "Количество",
  },
];

export default function NotificationsPage() {
  const [isDelete, setDelete] = useState<null | string[]>(null);
  const { context, setContext } = useContext(TableContext);
  const debouncedSearch = useDebounce(context.search, 500);

  const { data, isLoading, mutate } = useSWR(
    {
      url: `notification/list?page=1&search=${debouncedSearch}&sortBy=${context.sortValue}`,
    },
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000
    }
  );

  useEffect(() => {
    setContext((prev) => ({ ...prev, isLoading }));
  }, [isLoading]);


  const deleteMultiple = async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      console.error('No notifications selected for deletion');
      setDelete(null);
      return;
    }

    try {
      const response = await fetch('https://admin.swapp.kz/api/v1/notification', {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'SuperToken': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          ids: ids
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete notifications');
      }

      // Refresh the data after successful deletion
      await mutate();

      // Clear checked items and close modal
      setDelete(null);
      setContext(prev => ({
        ...prev,
        checked: []
      }));
    } catch (error) {
      console.error('Error deleting notifications:', error);
      setDelete(null);
    }
  }

  useEffect(() => {
    if (data?.result) {
      setContext((prev) => ({
        ...prev,
        data: data.result.items,
        labels: labels,
        goTo: "/notifications",
        sort: [],
        onDelete: (id: string) => setDelete([id]),
        filters: [],
        control: {
          label: "Удалить",
          buttonBG: ButtonBG.red,
          disabled: "checked",
          action: () => {
            if (context.checked && context.checked.length > 0) {
              setDelete(context.checked);
            }
          }
        }
      }));
    }
  }, [data, setContext, context.checked]);

  useEffect(() => {
    return () => {
      setContext(default_context);
    };
  }, []);

  return (
    <div>
      <Header subTitle="Информация" title="Уведомления" />
      <Table />

      {isDelete &&
        createPortal(
          <ModalDelete
            label={"Удалить"}
            close={() => setDelete(null)}
            onDelete={() => deleteMultiple(isDelete)}
          />,
          document.getElementById("page-wrapper")
        )}
    </div>
  );
}
