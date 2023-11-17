let popupHtmlTemplate = "";

popupHtmlTemplate += `<div class="poi">`;

popupHtmlTemplate += `<h2>{{ name }}`;
popupHtmlTemplate += "{% if ruby %} ({{ ruby }}){% endif %}";
popupHtmlTemplate += `</h2>`;

popupHtmlTemplate += ` <b>種別:</b> {% if type %}{{ type }}{% else %}小字名{% endif %} <br> `;

popupHtmlTemplate += `{% if image %}
  <qy-swiper style='height: 300px'>
    <qy-swiper-slide imageUrl="images/{{ image | safe }}" thumbnailUrl="images/{{ image | safe }}" imageType="image" caption="{{ name }}"></qy-swiper-slide>
  </qy-swiper>
{% endif %}`;

popupHtmlTemplate += `{% if description %}
 <b>説明:</b> {{ description }} <br>
{% endif %}`;

popupHtmlTemplate += `</div>`;
