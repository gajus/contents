$(function () {
    var loremIpsum = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis felis dolor, nec bibendum eros malesuada et. Vestibulum id nulla tincidunt, vestibulum elit non, laoreet diam. Mauris scelerisque cursus bibendum. Ut mattis, orci nec varius consectetur, ex ante ornare nisi, eu luctus quam dolor at nunc. Donec volutpat viverra ullamcorper. Sed eu lacinia libero, sit amet lacinia ex. Etiam viverra tortor eget pellentesque dignissim. Fusce sagittis est vitae massa pharetra, lacinia ultricies dui volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas nec convallis purus. Vivamus nec nunc in dui consectetur vulputate. Etiam euismod, mauris a pharetra laoreet, leo mi lacinia eros, at faucibus ipsum felis non velit. Duis vitae ipsum nisl. Etiam ultrices vulputate ante.', 'Integer non odio tincidunt, hendrerit lacus id, rutrum urna. Mauris vitae dui elementum, vulputate metus sollicitudin, efficitur velit. Praesent eu ullamcorper risus. Cras sapien leo, bibendum eu elit a, tincidunt tincidunt mauris. Pellentesque lacinia laoreet nunc, in laoreet justo. Aliquam non augue lacus. In hac habitasse platea dictumst. Donec sed interdum justo. Curabitur eget augue condimentum, hendrerit est in, sodales ligula. Sed imperdiet urna id diam interdum, non auctor magna dictum. Maecenas dapibus, quam a scelerisque semper, felis enim tristique dui, vel cursus nunc elit ac odio.', 'Suspendisse efficitur sollicitudin elit, a tristique ligula eleifend lobortis. Nam vel euismod metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vestibulum scelerisque velit eu velit blandit blandit. Nam et enim et dolor ultrices lacinia ut at eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam pulvinar eros id libero volutpat, ac accumsan nisi pharetra. Donec consequat iaculis orci a commodo. Pellentesque posuere feugiat viverra. Quisque dignissim purus nec scelerisque accumsan. Nullam sagittis nibh nec mauris ornare egestas.', 'Fusce et gravida augue. Aliquam feugiat tortor elit, eu mollis mauris bibendum quis. Aenean at ex sed libero vestibulum luctus. Suspendisse quis pretium augue, quis facilisis lectus. Nam commodo cursus massa sit amet sodales. Praesent ac consectetur lectus, ut imperdiet mauris. Quisque hendrerit ipsum eget pretium fringilla. Maecenas elementum vestibulum egestas. Proin eget tempor odio. Pellentesque ornare cursus vehicula. Nullam et venenatis neque, a fringilla risus. Mauris vehicula diam et felis interdum, vel molestie felis varius. Etiam vel orci ut purus auctor fringilla bibendum et urna. Quisque semper efficitur risus tincidunt ultricies.', 'Donec at nunc lectus. Fusce malesuada tellus tristique nisi porta egestas. Sed pretium molestie gravida. Vestibulum euismod dictum dolor, vel lobortis mi condimentum a. Proin eleifend dolor libero, vitae hendrerit neque mattis sit amet. Nunc magna massa, tempus eget massa a, vehicula porta tortor. Fusce a eleifend ex. Aliquam erat volutpat. Morbi ac elit id nibh vehicula vulputate. Fusce et purus at dui malesuada euismod. Praesent eget vestibulum neque, eget porta nisi. Mauris congue turpis dui, vitae aliquet ligula viverra non. Donec fermentum aliquam justo sit amet porta. Phasellus ullamcorper nisi elit, vestibulum maximus erat venenatis vel. Etiam a cursus ipsum, ut elementum mauris. Nunc imperdiet feugiat ex et lobortis.'];

    $.get('./example-template.html', function (template) {
        template = $($.parseHTML(template));

        template.find('h1, h2, h3, h4, h5, h6').each(function () {
            var length = Math.floor(Math.random() * 3) + 2;

            while (length--) {
                $(this).after( $('<p>').text(loremIpsum[Math.floor(Math.random() * 5)]) );
            }
        });

        $('.example').each(function () {
            var example = $(this);

            example.find('.main').append(template.clone());

            example.trigger('ready.example');
        });
    });
});