import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import { useSystems } from "@/lib/queries/systems";
import { useLocalSearchParams } from "expo-router";
import React from "react";

/**
 * Displays details for a specific system based on the route parameter.
 *
 * Retrieves the system ID from the URL, fetches the list of systems, and renders a header with the matched system's title.
 */
export default function SystemDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: systems } = useSystems();
  const system = systems?.find((system) => system.id === +id);

  // fetch the routines for that system

  return (
    <Container>
      <Header title={system?.title ?? ""}></Header>
    </Container>
  );
}
