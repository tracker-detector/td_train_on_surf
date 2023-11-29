# td_train_on_surf


This is the source code for the 'Train on Surf' chrome webextension. This extension aims to show 
the possibilities of ML in the web tracker detection field. The extension can be loaded from disk
onto any chrome based browser. Just download the latest release and load the manifest file into the
browser.

# Infrastructure

Here we briefly describe the extensions infrastructure. Please keep in mind that you may encounter 
bugs. In that case feel free to add an issue. You are also invited to fork or create a pull request
to make this application better.

## Background Script

The background script of this extension monitors the user's browsing behaviour blocks web tracker based 
on a tracking protection list. Furthermore each request gets encoded into a feature vector of 203 features.
These features are mainly the encoded url and method etc. These encoded features then get buffered and enriched by 
the sampler. The sampler over samples tracking requests and undersamples non-tracking requests.

After a the threshhold of 500 requests is met, the sampler creates a dataset of 6*512 webrequests and trains the
tensorflow model for 7 epochs. By then the model can most of the time correctly identify tracker for every website
it has visited. 

## Popup

The popup page is just the ui for displaying some information about the model. There are 5 pages which all display data based
on the tab you are on. The home page is the metric page which displays current metrics. The Stats page shows metrics of the last
10 tab refreshs and the tracker and request page show the identified tracker and the request payloads. On the final page you can
export your model.

# Goals

For contributors here are some goals we want to implement.

- Better and more efficent metric calculation and display

- More Settings to finetune training of the model

- Better data export for analysis

If you like this project feel free to contribute.