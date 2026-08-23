import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "../components/ui";
import { fetchNotifications } from "../services/notificationApi";
import { useNotificationStore } from "../stores/notificationStore";

export function useNotifications() {
  const [isVisible, setIsVisible] = useState(
    () =>
      typeof document === "undefined" || document.visibilityState === "visible",
  );
  const addPosts = useNotificationStore((state) => state.addPosts);
  const isOpen = useNotificationStore((state) => state.isOpen);
  const { toast } = useToast();
  const { data, error, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: isVisible,
    refetchInterval: isVisible ? 15000 : false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleVisibility = () =>
      setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!Array.isArray(data)) return;
    const count = addPosts(data);
    if (count && !isOpen)
      toast(`${count} new notification${count === 1 ? "" : "s"}`);
  }, [addPosts, data, isOpen, toast]);

  return { error, isLoading, isVisible, isOpen };
}
