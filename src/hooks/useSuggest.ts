// src/hooks/useSuggest.ts

import { useQuery } from "@tanstack/react-query";
import axiosSession from "@/lib/axiosSession";
import { LangCode } from "@/types";

export type SuggestItem = {
  id: string;
  label: string;
  value: string;
};

type SuggestResponse = {
  data: SuggestItem[];
};

type UseSuggestParams = {
  searchText: string;
  locale: LangCode;
  minLength?: number;
  enabled?: boolean;
};

const SUGGEST_API_PATH = "/products/suggest";

const useSuggest = ({ searchText, locale, minLength = 1, enabled = true }: UseSuggestParams) => {
  const trimmed = searchText.trim();

  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
    error: listError,
    refetch: listRefetch,
  } = useQuery<SuggestResponse, Error>({
    queryKey: ["products", "suggest", trimmed, locale],
    queryFn: async () => {
      const res = await axiosSession.get<SuggestResponse>(SUGGEST_API_PATH, {
        params: {
          searchText: trimmed,
          locale,
          limit: 8,
        },
      });
      return res.data;
    },
    enabled: enabled && trimmed.length >= minLength,
  });

  return {
    listData,
    isListLoading,
    isListFetching,
    listError,
    listRefetch,
  };
};

export default useSuggest;
