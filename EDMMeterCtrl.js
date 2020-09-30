/*global angular, $*/

'use strict';
angular.module('djz').controller('EDMMeterCtrl', [
  '$scope', '$timeout', '$document',
  function ($scope, $timeout, $document) {

    var taps = [];
    var tapCount = 8; // originally 3
    var currentBPM = 0;
    var bpm_L = 50;
    var bpm_U = 200;
    var numwedges = 6;
    var bpm_step = (bpm_U - bpm_L) / numwedges;
    var wedges = [];
    var blurbs = [];
    var blurbTitles = [];
    var videos = {
      'video1': {
        'youtubeid': 'K_h55O66uf0',
        'caption': 'DJ Screw - "My Mind Went Blank" (60 BPM)',
        'videobpm': 60
      },
      'video2': {
        'youtubeid': '20Mg5CZOT1M',
        'caption': 'Drake - "Started from the Bottom (Chopped & Screwed by DJ Dew)" (68 BPM)',
        'videobpm': 68
      },
      'video3': {
        'youtubeid': 't8h0d00gEh4',
        'caption': 'Jay-Z - "Lucifer" (86 BPM)',
        'videobpm': 86
      },
      'video4': {
        'youtubeid': 'wthgd_Rg1qg',
        'caption': 'Michael Jackson - "Butterflies" (91 BPM)',
        'videobpm': 91
      },
      'video5': {
        'youtubeid': '244BW5hozN0',
        'caption': 'Public Enemy - "Terminator X" (100 BPM)',
        'videobpm': 100
      },
      'video6': {
        'youtubeid': 'qq09UkPRdFY',
        'caption': 'Mariah Carey - "Fantasy" (102 BPM)',
        'videobpm': 102
      },
      'video7': {
        'youtubeid': '9JuCYQ9OzIk',
        'caption': 'Silvio Ecomo & Chuckie - "Moombah (Dave Nada Remix)" (108 BPM)',
        'videobpm': 108
      },
      'video8': {
        'youtubeid': 'SlJ3UeKmRiA',
        'caption': 'Dillon Francis - "Masta Blasta" (110 BPM)',
        'videobpm': 110
      },
      'video9': {
        'youtubeid': 'pgGefJtlNT8',
        'caption': 'Aphex Twin - "Pulsewidth" (120 BPM)',
        'videobpm': 120
      },
      'video10': {
        'youtubeid': '4nsKDJlpUbA',
        'caption': 'Disclosure - "When a Fire Starts to Burn" (124 BPM)',
        'videobpm': 124
      },
      'video11': {
        'youtubeid': 'IrWx3ONJdPE',
        'caption': 'Deniro Farrar ft. Flosstradamus - "Look at the Sky" (135 BPM)',
        'videobpm': 135
      },
      'video12': {
        'youtubeid': 'fnKNz7FxmPc',
        'caption': 'Baauer - "Harlem Shake" (140 BPM)',
        'videobpm': 140
      },
      'video13': {
        'youtubeid': 'MD8tP60c5EE',
        'caption': 'Caspa & Rusko - "Jahova" (144 BPM)',
        'videobpm': 144
      },
      'video14': {
        'youtubeid': 'R0bN9JRIqig',
        'caption': 'Buku - "All Deez" (170 BPM)',
        'videobpm': 170
      },
      'video15': {
        'youtubeid': '-rULmvm48_o',
        'caption': 'Black Sun Empire - "Feed the Machine" (172 BPM)',
        'videobpm': 172
      },
      'video16': {
        'youtubeid': '6lxDKR88ZoY',
        'caption': 'Rido ft. Thomas Oliver - "Twisted" (175 BPM)',
        'videobpm': 175
      }
    };

    var updateBPM = function (bpm) {
      var leftBPM = 50, rightBPM = 200; // originally 40, 220; avg should be 130
      var leftAngle = 0, rightAngle = 180; // originally 30, 150
      var clampBPM = Math.max(Math.min(bpm, rightBPM), leftBPM);
      var angle = ((clampBPM - leftBPM) / (rightBPM - leftBPM)) * (rightAngle - leftAngle) + leftAngle;
      updateNeedle(angle);
      currentBPM = bpm;
      updateBlurb();
    };

    var updateNeedle = function (angle) {
      var needle = document.getElementById('needle');
      needle.style['-webkit-transform'] = 'rotate(' + (parseInt(angle, 10) - 90) + 'deg)';
      needle.style.transform = 'rotate(' + (parseInt(angle, 10) - 90) + 'deg)';
    };
    
    var updateBlurb = function () {
      var currentBlurb;
      var currentBlurbTitle;
      
      if (currentBPM >= 60 && currentBPM < 75) {
        currentBlurb = blurbs[0];
        currentBlurbTitle = blurbTitles[0];
      } else if (currentBPM >= 75 && currentBPM < 105) {
        currentBlurb = blurbs[1];
        currentBlurbTitle = blurbTitles[1];
      } else if (currentBPM >= 105 && currentBPM < 115) {
        currentBlurb = blurbs[2];
        currentBlurbTitle = blurbTitles[2];
      } else if (currentBPM >= 115 && currentBPM < 135) {
        currentBlurb = blurbs[3];
        currentBlurbTitle = blurbTitles[3];
      } else if (currentBPM >= 135 && currentBPM < 160) {
        currentBlurb = blurbs[4];
        currentBlurbTitle = blurbTitles[4];
      } else if (currentBPM >= 160) {
        currentBlurb = blurbs[5];
        currentBlurbTitle = blurbTitles[5];
      } else {
        currentBlurb = blurbs[6]; // display text about why this box is here
        currentBlurbTitle = blurbTitles[6];
      }
      
      blurbs.each(function (i, thisBlurb) {
        if (thisBlurb === currentBlurb) {
          $(thisBlurb).addClass('active');
        } else {
          $(thisBlurb).removeClass('active');
        }
      });

      blurbTitles.each(function (i, thisBlurbTitle) {
        if (thisBlurbTitle === currentBlurbTitle) {
          $(thisBlurbTitle).addClass('active');
        } else {
          $(thisBlurbTitle).removeClass('active');
        }
      });
    };

    var thrum = function () {
      var currentWedge;
      
      if (currentBPM >= bpm_L && currentBPM < (bpm_L + bpm_step)) {
        currentWedge = wedges[0];
      } else if (currentBPM >= (bpm_L + bpm_step) && currentBPM < (bpm_L + 2 * bpm_step)) {
        currentWedge = wedges[1];
      } else if (currentBPM >= (bpm_L + 2 * bpm_step) && currentBPM < (bpm_L + 3 * bpm_step)) {
        currentWedge = wedges[2];
      } else if (currentBPM >= (bpm_L + 3 * bpm_step) && currentBPM < (bpm_L + 4 * bpm_step)) {
        currentWedge = wedges[3];
      } else if (currentBPM >= (bpm_L + 4 * bpm_step) && currentBPM < (bpm_L + 5 * bpm_step)) {
        currentWedge = wedges[4];
      } else if (currentBPM >= (bpm_L + 5 * bpm_step) && currentBPM < bpm_U) {
        currentWedge = wedges[5];
      }
      
      wedges.each(function (i, thisWedge) {
        if (thisWedge === currentWedge) {
          $(thisWedge).addClass('on');
        } else {
          $(thisWedge).removeClass('on');
        }
      });
      
      $timeout(thrum, 500 * 30 / currentBPM);
      $(currentWedge).toggleClass('highlighted');
    };
    
    $scope.lightUp = function (evt) { /* during mouseover */
      var lightButton = evt.currentTarget;
      lightButton = $(lightButton);
      $(lightButton).removeClass('unclicked');
      $(lightButton).addClass('highlighted');
    };

    var currentlyClicked = null;
    
	// RETURN BUTTON TO STATE
    $scope.goBack = function (evt) { /* during mouseleave */
      var regularButton = evt.currentTarget;
      regularButton = $(regularButton);
      $(regularButton).removeClass('highlighted');
      
      if (!currentlyClicked) {
        $(regularButton).removeClass('clicked');
      }
    };
    
	// PLAY EXAMPLE VIDEO
    $scope.showExample = function (evt) { /* on click; should unclick everything else */
      var clickedButton = evt.currentTarget;
      clickedButton = $(clickedButton);
      
      if (currentlyClicked) {
        unclick(currentlyClicked);
      }
      
      currentlyClicked = clickedButton;
      $(clickedButton).removeClass('highlighted');
      $(clickedButton).addClass('clicked');
     
      // now show the video 
      var currentVideo = videos[evt.currentTarget.id];
      var mainVideoDiv = $('.examplevideo');
      var titleDiv = mainVideoDiv.children('.putTitleHere');
      var videoDiv = mainVideoDiv.children('.putVideoHere');
      videoDiv.empty();
      var youtubeLink = '<iframe width=\"340\" height=\"255\" src=\"//www.youtube.com/embed/' + currentVideo.youtubeid + '?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>';
      titleDiv.text(currentVideo.caption);
      videoDiv.append(youtubeLink);
      
      currentBPM = currentVideo.videobpm;
      updateBPM(currentBPM);
      updateBlurb();
      document.getElementById('bpm').innerText = currentBPM + ' BPM';
    };
    
    var unclick = function (currentlyClicked) {
      currentlyClicked.removeClass('clicked');
      currentlyClicked.removeClass('highlighted');
      currentlyClicked.addClass('unclicked');
    };
    
    $document.keydown(function (e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        $scope.tap();
      }
    });
    
    $document.keyup(function (e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        $scope.untap();
      }
    });
        
    $scope.setNumtaps = function () {
      tapCount = parseInt(document.getElementById('tapselection').value, 10);
    };
    
	// INITIALIZE
    $scope.convertedTime = 0;
      
	// MATHS FOR CONVERTING BPM TO SECONDS
    $scope.convertToTime = function () {
      var bpmInput = parseFloat(document.getElementById('bpmautofill').value);
      if (!isNaN(bpmInput)) {
        $scope.convertedTime = 60 / bpmInput;
        document.getElementById('timeautofill').value = $scope.convertedTime;
      }
    };
    
	// INITIALIZE
    $scope.convertedBPM = 0;
    
	// MATHS FOR CONVERTING SECONDS TO BPM
    $scope.convertToBPM = function () {
      var timeInput = parseFloat(document.getElementById('timeautofill').value);
      if (!isNaN(timeInput)) {
        $scope.convertedBPM = 60 / timeInput;
        document.getElementById('bpmautofill').value = $scope.convertedBPM;
      }
    };
    
    // MUTE AUDIO
    $scope.mute = function (e) {
      e = e || window.event;
      var muteAudio = $('#tap-sound')[0];
      muteAudio.muted = !muteAudio.muted;
      e.preventDefault();
      
      if (muteAudio.muted) {
        $('.mute').addClass('muted');
      } else {
        $('.mute').removeClass('muted');
      }
    };
    
	// TAP BUTTON
    $scope.tap = function () {
      document.getElementById('tap').className = 'tapped';
      
      var sound = $('#tap-sound')[0];
      
      sound.pause();
      sound.currentTime = 0;
      // sound.noteOn(0);
      sound.play();
      
      taps.push(new Date()); // taps is the array of timestamps
      if (taps.length > tapCount) {
        taps.shift();
      }
      
      if (taps.length < 2) {
        return; // only computes it for > 1 taps
      }
      var last = taps[0];
      var tot = 0;
      for (var x = 1; x < taps.length; x += 1) {
        var delay = taps[x] - last;
        tot += delay;
        last = taps[x];
      }
      var avg = tot / (taps.length - 1);
      
      var s = avg / 1000;
      var bpm = 60 / s;
      $('#bpm').text(Math.round(bpm) + ' BPM');
      document.getElementById('bpmautofill').value = bpm;
      document.getElementById('timeautofill').value = s;
      updateBPM(bpm);
      /* if (bpm < 50) {
        $('#tooslow').text('TOO SLOW!');
        $timeout(function () {
          $('#tooslow').text('');
        }, 1000);
      } else if (bpm > 200) {
        $('#toofast').text('TOO FAST!');
        $timeout(function () {
          $('#toofast').text('');
        }, 1000);
      } */
      
      $timeout(function () {
        var t = new Date();
        if (taps.length < 1) {
          return;
        }
        
        // lag for more than 2 seconds resets BPM
        if (t - taps[taps.length - 1] >= 2000) {
          // updateBPM(0); // puts needle back to 0
          taps = [];
          // document.getElementById('bpm').innerText = '';
        }
      }, 2000);
    };

    $scope.untap = function () {
      document.getElementById('tap').className = '';
    };

    // Prevent zoom on mobile
    $scope.preventZoom = function (e) {
      e.preventDefault();
      return false;
    };

    blurbs = $('.blurb');
    blurbTitles = $('.blurbtitle');
    updateBPM(0);
    wedges = $('.bpm');
    thrum();

  }
]);
