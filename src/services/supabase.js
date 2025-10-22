//import { URL, KEY } from '../environment.env';
import { supabase } from "../environment.env";

export { fetchTech, fetchAbilitys, fetchVillages };

async function fetchTech(routeProcessed) {
  let query = supabase.from("technique_details").select("*");

  // Si hay 1 elemento: buscar por affiliation_abbr
  if (routeProcessed.length === 1) {
    query = query.eq("affiliation_abbr", routeProcessed[0]);
  }
  // Si hay 2 elementos: buscar por affiliation_abbr y category_name
  else if (routeProcessed.length === 2) {
    query = query
      .eq("affiliation_abbr", routeProcessed[0])
      .eq("category_name", routeProcessed[1]);
  }
  // Si hay 3 elementos: buscar por affiliation_abbr, category_name y subcategory_name
  else if (routeProcessed.length === 3) {
    query = query
      .eq("affiliation_abbr", routeProcessed[0])
      .eq("category_name", routeProcessed[1])
      .eq("subcategory_name", routeProcessed[2]);
  }

  let { data: technique_details, error } = await query;

  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return technique_details || [];
}

async function fetchAbilitys(routeProcessed){
  //Solo se debe ejecutar si hay más de un elemento, es decir, 2ndo nivel del dropdown
  if(routeProcessed.length < 2) return [];

  let query = supabase.from("entity_profile_details").select("*");

  // Si hay 1 elemento: buscar por affiliation_abbr
  if (routeProcessed.length === 2) {
    query = query.eq("category_name", routeProcessed[1]);
  }
  // Si hay 2 elementos: buscar por affiliation_abbr y category_name
  else if (routeProcessed.length === 3) {
    query = query
      .eq("category_name", routeProcessed[0])
      .eq("subcategory_name", routeProcessed[2]);
  }

  let { data: technique_details, error } = await query;

  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return technique_details || [];
}

async function fetchVillages(){
  let { data: affiliations, error } = await supabase.from("affiliations").select("*").eq("is_active", true);
  
  if (error) {
    console.error("Error de conexión:", error);
    return [];
  }

  return affiliations || [];
}

