var breeds;
$('#breed_search').on('input', function(e) {
  var search_str = $(this).val();
  searchBreeds(search_str);
});
function searchBreeds(search_str) {
  var string_length = search_str.length 
  search_str = search_str.toLowerCase(); 
  for (var i = 0; i < breeds.length; i++) 
  {
    var breed_name_snippet = breeds[i].name.substr(0, string_length).toLowerCase(); 
    if (breed_name_snippet == search_str) {
      getDogByBreed(breeds[i].id) 
      return; 
    }
  }
}
var $breed_select = $('select.breed_select');
$breed_select.change(function() {
  var id = $(this).children(":selected").attr("id");
  getDogByBreed(id)
});
function getBreeds() {
  ajax_get('https://api.thedogapi.com/v1/breeds', function(data) {
    populateBreedsSelect(data)
    breeds = data
  });
}
function populateBreedsSelect(breeds) {
  $breed_select.empty().append(function() {
    var output = '';
    $.each(breeds, function(key, value) {
      output += '<option id="' + value.id + '">' + value.name + '</option>';
    });
    return output;
  });
}
function getDogByBreed(breed_id) {

  ajax_get('https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function(data) {

    if (data.length == 0) {
     
      clearBreed();
      $("#breed_data_table").append("<tr><td>Sorry, no Image for that breed yet</td></tr>");
    } else {

      displayBreed(data[0])
    }
  });
}
function clearBreed() {
  $('#breed_image').attr('src', "");
  $("#breed_data_table tr").remove();
}
function displayBreed(image) {
  $('#breed_image').attr('src', image.url);
  $("#breed_data_table tr").remove();

  var breed_data = image.breeds[0]
  $.each(breed_data, function(key, value) {
 
    if (key == 'weight' || key == 'height') value = value.metric

    $("#breed_data_table").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>");
  });
}
function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
getBreeds();
var select_breed = $('#breed');
var select_sub_breed = $('#sub-breed');
var button_get_images = $('#get-images-button');
var div_container2 = $('#container2');
select_sub_breed.hide();
var recieved_dom_data;

(
    function ()
{
    $.ajax({
        method: "get",
        url: "https://dog.ceo/api/breeds/list/all",
        success: function (response)
        {
            recieved_dom_data = response.message;
            for (let current_breed in response.message)
            {
                select_breed.append($('<option value="' + current_breed + '">' + current_breed + '</option>'))
            }
        }
    });
})();

setInterval(function ()
{
    if (recieved_dom_data[select_breed.val()].length != 0)
    {
        if(select_sub_breed.is(':visible'))
        {
            return;
        }
        $('#sub-breed option').remove();
        for (let current_sub_breed of recieved_dom_data[select_breed.val()])
        {
            select_sub_breed.append($('<option value="' + current_sub_breed + '">' + current_sub_breed + '</option>'))
        }
        select_sub_breed.show();
    }
    else
    {
        select_sub_breed.hide();
    }
}, 300)


function show_by_breed()
{
    $.ajax({
        method: "get",
        url: "https://dog.ceo/api/breed/" + select_breed.val() + "/images",
        success: function (response)
        {
            for (let link of response.message)
            {
                div_container2.append($(document.createElement('img')).attr('src', link));
            }
        }
    });
}
function show_by_sub_breed()
{
    $.ajax({
        method: "get",
        url: "https://dog.ceo/api/breed/" + select_breed.val() + "/" + select_sub_breed.val() + "/images",
        success: function (response)
        {
            for (let link of response.message)
            {
                div_container2.append($(document.createElement('img')).attr('src', link));
            }
        }
    });
}


button_get_images.click(function ()
{
    $('img').remove();
    if (select_sub_breed.val() != null)
    {
        show_by_sub_breed();
    }
    else
    {
        show_by_breed();
    }
});