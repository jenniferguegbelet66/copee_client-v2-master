export type RequestArgs = {
  [index: string]: string;
};

export type COPEE_EQUIPMENT_PRODUCT = {
  ep_id: number;
  ep_product_id: string;
  ep_category_id: number;
  ep_reference: string;
  ep_builder: string;
  ep_product_type: string;
};

export type COPEE_EQUIPMENT_CATEGORY = {
  ec_id: number;
  ec_code: string;
  ec_description: string;
};

export type COPEE_PRICE = {
  prices_id: number;
  prices_et_price: number;
  prices_vat_amount: number;
  prices_vat_rate: number;
  prices_creation_date: string;
  prices_validity_date: string;
  prices_currency: string;
  prices_minimal_amount: number;
  prices_maximal_amount: number;
};

export type COPEE_PROMOTION = {
  promotions_id: number;
  promotions_name: string;
  promotions_description: string;
  promotions_start_date: string;
  promotions_end_date: string;
};

export type COPEE_SERVICE = {
  es_id: number;
  es_description: string;
  es_title: string;
};

export type COPEE_EQUIPMENT_SERVICE = {
  es_id: number;
  es_description: string;
  es_title: string;
};

export type PRICE_WITH_DEPENDENCIES = {
  price: COPEE_PRICE;
  promotion: COPEE_PROMOTION;
  service: COPEE_EQUIPMENT_SERVICE;
};

export type PRODUCT_WITH_DEPENDENCIES = {
  product: COPEE_EQUIPMENT_PRODUCT;
  category: COPEE_EQUIPMENT_CATEGORY;
  price: PRICE_WITH_DEPENDENCIES;
};

export type MERGED_SQL_MONGO_PRODUCT_WITH_DEPENDENCIES = {
  mixed_props: { [index: string]: string };
  general_props: PRODUCT_WITH_DEPENDENCIES;
};

export type MERGED_SQL_MONGO_PRODUCT_LIST_WITH_DEPENDENCIES =
  MERGED_SQL_MONGO_PRODUCT_WITH_DEPENDENCIES[];

export type COPEE_CATALOG_WITH_DEPENDENCIES = {
  products: MERGED_SQL_MONGO_PRODUCT_WITH_DEPENDENCIES;
};

export type COPEE_APPLI_CLIENT = {
  client_id?: number;
  client_date_created?: string;
  client_last_name: string;
  client_first_name: string;
  client_email: string;
  client_phone: string;
  client_fiscal_year_income: number;
  client_birthdate: string;
};
export type COPEE_APPLI_CLIENT_LIST = COPEE_APPLI_CLIENT[];

export type COPEE_APPLI_CLIENT_WITH_DEPENDENCIES = {
  client: COPEE_APPLI_CLIENT;
  client_home: COPEE_APPLI_CLIENT_HOME | undefined;
  client_home_bill: COPEE_APPLI_CLIENT_HOME_BILLS | undefined;
  client_home_equipment: COPEE_CLIENT_HOME_APPLI_EQUIPMENT | undefined;
  client_ass: COPEE_APPLI_CLIENT_ASS_LIST | undefined;
  client_installation: COPEE_APPLI_INSTALLATION | undefined;
};

export type COPEE_APPLI_CLIENT_ASS = {
  ca_id: number;
  ca_client_id: number;
  ca_company_id: number;
  ca_call_date: string;
  ca_call_reason: string;
  ca_intervention_date: string;
  ca_comment: string;
  ca_is_resolved: number;
};
export type COPEE_APPLI_CLIENT_ASS_LIST = COPEE_APPLI_CLIENT_ASS[];

export type COPEE_APPLI_CLIENT_HOME = {
  ch_id: number;
  ch_client_id: number;
  ch_geo_id: number;
  ch_construction_year: number;
  ch_area: number;
  ch_residents: number;
  ch_roof_positionning: string;
  ch_roof_slope: number;
  ch_label: string;
  ch_tr: number;
  ch_huc: number;
  ch_isolation: string;
};
export type COPEE_APPLI_CLIENT_HOME_LIST = COPEE_APPLI_CLIENT_HOME[];

export type COPEE_APPLI_CLIENT_HOME_WITH_DEPENDENCIES = {
  client_home: COPEE_APPLI_CLIENT_HOME;
  geo: COPEE_APPLI_GEO;
};

export type COPEE_APPLI_GEO = {
  g_id: number;
  g_zone: string;
  g_latitude: number;
  g_longitude: number;
  g_altitude: number;
  g_department: number;
  g_city: string;
  g_address: string;
  g_postcode: number;
};

export type COPEE_APPLI_CLIENT_HOME_BILLS = {
  chb_id: number;
  chb_home_id: number;
  chb_electricity: number;
  chb_natural_gas: number;
  chb_propane_gas: number;
  chb_wood: number;
  chb_heating_oil: number;
  chb_year: string;
};
export type COPEE_APPLI_CLIENT_HOME_BILLS_LIST =
  COPEE_APPLI_CLIENT_HOME_BILLS[];

export type COPEE_CLIENT_HOME_APPLI_EQUIPMENT = {
  che_id: number;
  che_home_id: number;
  che_equipment_type: string;
  che_description: string;
};
export type COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST =
  COPEE_CLIENT_HOME_APPLI_EQUIPMENT[];

export type COPEE_APPLI_INSTALLATION = {
  ci_id?: number;
  ci_client_id: number;
  ci_created_at: string;
};
export type COPEE_APPLI_INSTALLATION_LIST = COPEE_APPLI_INSTALLATION[];

export type COPEE_APPLI_INSTALLATION_VERSION = {
  civ_id: number;
  civ_installation_id: number;
  civ_user_id: number;
  civ_version_number: number;
  civ_description: string;
  civ_created_at: string;
  civ_updated_at: string;
  civ_status: string;
};

export type COPEE_APPLI_INSTALLATION_VERSION_LIST =
  COPEE_APPLI_INSTALLATION_VERSION[];

export type COPEE_APPLI_USER = {
  user_id?: number;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_phone: string;
  user_is_active: number;
  user_date_created: string;
  user_recruitment_date: string;
};
export type COPEE_APPLI_USER_LIST = COPEE_APPLI_USER[];
