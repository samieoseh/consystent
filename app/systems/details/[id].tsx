import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import { useSystems } from "@/lib/queries/systems";
import { useLocalSearchParams } from "expo-router";
import React from "react";

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
