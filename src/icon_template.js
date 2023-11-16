let iconTemplate = "";

iconTemplate = `
{%- set iconUrl = "stone" -%}
{%- set width = 28 -%}
{%- set height = 40 -%}

{%- if type.match("地蔵") -%}
  {%- set iconUrl = "jizo" -%}
{%- elif type.match("池跡") -%}
  {%- set iconUrl = "culvert" -%}
{%- elif type.match("如来") -%}
  {%- set iconUrl = "nyorai" -%}
{%- elif type.match("道標") -%}
  {%- set iconUrl = "stone_display" -%}
{%- elif type.match("道") -%}
  {%- set iconUrl = "alley" -%}
{%- elif type.match("神社") -%}
  {%- set iconUrl = "shrine" -%}
{%- elif type.match("寺院") -%}
  {%- set iconUrl = "stone_tower" -%}
{%- elif type.match("陵墓") -%}
  {%- set iconUrl = "stone" -%}
{%- elif type.match("石塚") -%}
  {%- set iconUrl = "sekijin" -%}
{%- elif type.match("橋") -%}
  {%- set iconUrl = "balustrade" -%}
{%- elif type.match("山") -%}
  {%- set iconUrl = "mount" -%}
{%- elif type.match("地名") -%}
  {%- set iconUrl = "slope" -%}
{%- elif type.match("店") -%}
  {%- set iconUrl = "sekishi" -%}
{%- elif type.match("塚") -%}
  {%- set iconUrl = "kinenhi" -%}
{%- endif -%}

./assets/{{- iconUrl -}}.png,{{- width -}},{{- height -}}
`;