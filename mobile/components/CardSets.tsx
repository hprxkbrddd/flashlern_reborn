import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

export function CardSets() {
  const [activeTab, setActiveTab] = useState("my");
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Flashcard sets</Text>

        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Фильтры</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.container}>

      <View style={styles.search}>
          <Text style={styles.searchText}>Search by title...</Text>
      </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setActiveTab("my")} style={[styles.tab, activeTab === "my" && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === "my" && styles.activeText]}>My</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab("saved")} style={[styles.tab, activeTab === "saved" && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === "saved" && styles.activeText]}>Saved</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab("Popular")} style={[styles.tab, activeTab === "Popular" && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === "Popular" && styles.activeText]}>Popular</Text>
          </TouchableOpacity>
        </View>



        {/* Empty */}
        <Text style={styles.empty}>
          No sets in this section yet.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  container: {
    paddingHorizontal: 16,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderColor: "#eee",
  },

  tab: {
    backgroundColor: "#f3f3f3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e3e3e3"
  },

  activeTab: {
    borderWidth: 1,
    borderColor: "#ff6b3d",
    backgroundColor: "#fff",
  },

  tabText: {
    fontSize: 14,
    color: "#333",
  },

  activeText: {
    color: "#ff6b3d",
    fontWeight: "600",
  },

  search: {
    backgroundColor: "white",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#ddd",
  },

  searchText: {
    color: "#888",
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,

  },

  filterBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  filterText: {
    fontSize: 13,
  },

  empty: {
    textAlign: "center",
    color: "#999",
    fontSize: 13,
    marginTop: 50,
  },
});