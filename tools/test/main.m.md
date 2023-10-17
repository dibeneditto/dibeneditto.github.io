```matlab

%% reset MATLAB workspace
close all;
clear;
clc;

% ---
% TITLE: 
%     Preparation and Statistics MATLAB Program for Thesis Project Data
% AUTHOR: 
%     Lukas W. DiBeneditto, https://dibeneditto.com/
% CREATED: 
%     2023 Aug 08
% DESCRIPTION: 
%     This MATLAB program prepares the recorded data and then runs various
%     statistics tests on that data for the Master of Science in Biomedical
%     Engineering Thesis titled "Temporary Liver Support Using Artificial
%     Lung Technologies: Ammonia Removal via Peritoneal Dialysis for Acute
%     Liver Failure with PFC and PDMS at Vacuum Pressure", found here:
%     https://www.proquest.com/docview/2864402381 and an up to date version
%     of this code and data can be found at:
%     https://doi.org/10.17605/OSF.IO/GJFPD
% KEYWORDS: 
%     acute liver failure (ALF), peritoneal dialysis, polydimethylsiloxane
%     (PDMS) silicone, perfluorocarbons (PFCs), hyperammonemia, ammonia
%     removal
% PUBLISHER: 
%     Lukas W. DiBeneditto, Biomedical Engineering, Carnegie Mellon
%     University, Pittsburgh PA USA
% VERSION: 
%     2023.10.15.101
% --- 

programVersion = 'v.2023.10.15.101';

% Data Recorded: 2023 Jun 30 to 2023 Jul 16

%% NOTE
% ## This program assumes and requires:
%     - same number trials in meta.csv (16) as trial folders (16)
%     - there is a "_trials" folder that contains all trial folders
%     - the trial folders are labeled "trial1", "trial2", ... "trial16"
%     - in each trial folder has a sub required folder is labeled
%       "1-preprocessed", where the minmal processing has been done to
%       prepare them for MATLAB
%     - in each "1-preprocessed" folder there are (4) required files 
%       labeled "arduino.tsv", "omega.txt", "toxirae.csv", and "vernier.csv"
%
% ## Contents of meta.csv (Note 16 trials):
%   trial,phase1VacOffBeg,...
%   1,2023-06-30 15:58:36.000,...
%   2,2023-07-12 21:22:02.000,...
%   :
%   16,2023-07-16 06:18:34.000,...
%
% ## Required Folder Structure (Note 16 trials):
%   Working Directory
%     |
%     |   meta.csv                (REQUIRED)
%     |   main.m                  (REQUIRED, this current file)
%     |   data-analysis.pdf
%     |   readme.txt
%     +---_trials                 (REQUIRED folder)
%         +---trial1              (REQUIRED folder)
%         |   +---0-raw
%         |   |   (original device recorded files)
%         |   \---1-preprocessed  (REQUIRED folder)
%         |       arduino.tsv     (REQUIRED file)
%         |       omega.txt       (REQUIRED file)
%         |       toxirae.csv     (REQUIRED file)
%         |       vernier.csv     (REQUIRED file)
%         :
%         \---trial16             (REQUIRED folder)
%             +---0-raw
%             |   (original device recorded files)
%             \---1-preprocessed  (REQUIRED folder)
%                 arduino.tsv     (REQUIRED file)
%                 omega.txt       (REQUIRED file)
%                 toxirae.csv     (REQUIRED file)
%                 vernier.csv     (REQUIRED file)
%
% ## Information about the contents of the meta.csv file:
%     - 17 rows, 1 header row, 16 trial rows - 29 columns
%
%         Data Created Before this MATLAB Program Running (manually):
%             trial:
%                 trial number for each row
%             phase1VacOffBeg:
%                 datetime phase 1 started, roller pump on vacuum pump off
%                 (this is also the start of the experiment trial)
%             phase1VacOffEnd:
%                 datetime phase 1 stopped, roller pump on vacuum pump off
%             phase2VacOnBeg:
%                 datetime phase 2 started, roller pump on vacuum pump on
%                 (the moment the vacuum pump was turned on)
%             phase2VacOnEnd:
%                 datetime phase 2 stopped, roller pump on vacuum pump on
%             phase3VacOffBeg:
%                 datetime phase 3 started, roller pump on vacuum pump off
%                 (the moment the vacuum pump was turned off)
%             phase3VacOffEnd:
%                 datetime phase 3 stopped, roller pump on vacuum pump off
%                 (this is also the stop of the experiment trial)
%             arduinoBeg:
%                 date and time the arduino device started recording
%             omegaBeg:
%                 date and time the omega device started recording
%             vernierBeg:
%                 date and time the vernier device started recording
%             volumeRODIWaterML:
%                 volume of reverse osmosis deionized (RODI or RO/DI) water
%                 that circulated in the liquid loop
%             volumePFCML:
%                 volume of 3M FC-770 perfluorinated compound (PFC) or
%                 perfluoro compound that circulated in the liquid loop
%             volumeNH4OHUL:
%                 (μL) units, volume of ammonium hydroxide (NH4OH) Stock
%                 Solution, ~25% NH3 basis (w/w), 14.679 M liquid NH4OH,
%                 circulated in the liquid loop, some eventually diffuses
%                 through the Polydimethylsiloxane (PDMS) filter and turns
%                 into ammonia (NH3) gas
%             volumeNH4OHUMOLL:
%                 (μmol / L) units, volume of ammonium hydroxide (NH4OH)
%                 Stock Solution, ~25% NH3 basis (w/w), 14.679 M liquid
%                 NH4OH, circulated in the liquid loop, some eventually
%                 diffuses through the Polydimethylsiloxane (PDMS) filter
%                 and turns into ammonia (NH3) gas
%
%         Data Created After this MATLAB Program Running (manually):
%             phase1duration:
%                 (hours minutes and seconds) units, time duration phase 1
%             phase2duration:
%                 (hours minutes and seconds) units, time duration phase 2
%             phase3duration:
%                 (hours minutes and seconds) units, time duration phase 3
%             phase2psiaA0:
%                 (PSIA = PSI Absolute = pounds per square inch absolute)
%                 units, mean (average) pressure over entire phase 2
%                 duration, in line of the liquid loop, immediately before
%                 the PDMS filter, recorded by arduino device
%             phase2psiaA1:
%                 (PSIA = PSI Absolute = pounds per square inch absolute)
%                 units, mean (average) pressure over entire phase 2
%                 duration, in line of the liquid loop, immediately after
%                 the PDMS filter, recorded by arduino device
%             phase2psiaA2:
%                 (PSIA = PSI Absolute = pounds per square inch absolute)
%                 units, mean (average) pressure over entire phase 2
%                 duration, in line of the gas path, immediately before the
%                 omega device measuring ammonia (NH3) gas, recorded by
%                 arduino device, exposed to dry lab air and ammonia gas
%             phase2absolutePressurePSIA:
%                 (PSIA = PSI Absolute = pounds per square inch absolute)
%                 units, mean (average) pressure over entire phase 2
%                 duration, in line of the gas path, before the
%                 Polydimethylsiloxane (PDMS) filter, recorded by the omega
%                 device, exposed to dry lab air only
%             phase2gasTemperatureC:
%                 (C = degrees Celsius) units, mean (average) temperature
%                 over entire phase 2 duration, in line of the gas path,
%                 before the Polydimethylsiloxane (PDMS) filter, recorded
%                 by the omega device, exposed to dry lab air only
%             phase2volumetricFlowRateRawCCM:
%                 (CCM = cubic centimetre) units, mean (average) flow rate
%                 over entire phase 2 duration, in line of the gas path,
%                 before the Polydimethylsiloxane (PDMS) filter, recorded
%                 by the omega device, exposed to dry lab air only, not
%                 corrected for temperature, pressure, and gas type
%             phase2volumetricFlowRateStandardizedSCCM:
%                 (SCCM = standard cubic centimetre) units, mean (average)
%                 flow rate over entire phase 2 duration, in line of the
%                 gas path, before the Polydimethylsiloxane (PDMS) filter,
%                 recorded by the omega device, exposed to dry lab air
%                 only, corrected by omega device for temperature,
%                 pressure, and gas type (air), National Institute of
%                 Standards and Technology (NIST) traceable calibration
%             phase2DataSet1AmmoniummgL:
%                 (mg/L = ppm) units, mean (average) ammonium (NH4+)
%                 measurement from vernier device, in line of the fluid
%                 loop, specifically in the vortex mixing tank, measured
%                 via bluetooth (to prevent voltage interference from pH
%                 sensor)
%             phase2DataSet1PotentialmV:
%                 (mV = millivolt) units, mean (average) electric potential
%                 measurement from vernier device, in line of the fluid
%                 loop, specifically in the vortex mixing tank, measured
%                 via bluetooth (to prevent voltage interference from pH
%                 sensor)
%             phase2DataSet1TemperatureC:
%                 (C = degrees Celsius) units, mean (average) electric
%                 potential measurement from vernier device, in line of the
%                 fluid loop, specifically in the vortex mixing tank,
%                 measured via wire connection
%             phase2DataSet1pH:
%                 (pH = potential of hydrogen) units, mean (average) pH
%                 measurement from vernier device, in line of the fluid
%                 loop, specifically in the vortex mixing tank, measured
%                 via wire connection
%             phase2Sensor1GasReading:
%                 (mg/L = ppm) units, mean (average) ammonia (NH3) gas
%                 reading pulled through the Polydimethylsiloxane (PDMS)
%                 filter at vacuum pressure through the dry lab air
%                 supplied



%% logging start
% start logging MATLAB command window to text file
current = string(datetime("now", "Format", "yyyyMMddHHmmss"));
diaryFilename = strcat('log-', current, '.txt');
diary(diaryFilename);



%% program started
disp('program started')
disp('M.S. Thesis Project Data Preparation and Statistics')
disp(['(c) 2023, Lukas W. DiBeneditto, ', programVersion])
disp(['MATLAB ', version])



%% PREPARATION
%  ------------------------------------------------------------------------



%% preparation started
disp('====preparation started====')



%% import datetime data from meta.csv
disp('import datetime data from meta.csv')

% check if 'meta.csv' exists
if ~isfile('meta.csv')

    % throw warning if meta.csv does not exist
    warning(['File meta.csv does not exist. ',...
             'Please ensure the file is in the current directory.']);

    % Exit the script if file doesn't exist
    return; 

end % <-- end if

try
    % set up import options and import data
    opts = delimitedTextImportOptions("NumVariables", 29);

    % specify range and delimiter
    opts.DataLines = [2, Inf];
    opts.Delimiter = ",";

    % specify column names
    opts.VariableNames = ["trial", ...
                          "phase1VacOffBeg", ...
                          "phase1VacOffEnd", ...
                          "phase2VacOnBeg", ...
                          "phase2VacOnEnd", ...
                          "phase3VacOffBeg", ...
                          "phase3VacOffEnd", ...
                          "arduinoBeg", ...
                          "omegaBeg", ...
                          "vernierBeg", ...
                          "volumeRODIWaterML", ...
                          "volumePFCML", ...
                          "volumeNH4OHUL", ...
                          "volumeNH4OHUMOLL"];

    % specify column types
    opts.VariableTypes = ["double", ...
                          "datetime", ...
                          "datetime", ...
                          "datetime", ...
                          "datetime", ...
                          "datetime", ...
                          "datetime", ...
                          "datetime", ...
                          "datetime", ...
                          "datetime", ...
                          "double", ...
                          "double", ...
                          "double", ...
                          "double"];

    % specify file level properties
    opts.ExtraColumnsRule = "ignore";
    opts.EmptyLineRule = "read";

    % specify variable properties
    opts = setvaropts(opts, "phase1VacOffBeg", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "phase1VacOffEnd", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "phase2VacOnBeg", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "phase2VacOnEnd", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "phase3VacOffBeg", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "phase3VacOffEnd", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "arduinoBeg", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "omegaBeg", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");
    opts = setvaropts(opts, "vernierBeg", ...
                            "InputFormat", "yyyy-MM-dd HH:mm:ss.SSS");

    % import data
    M = readtable("meta.csv", opts);

    % clear temporary variables
    clear opts
    
    % display successful import message
    disp('  successfully imported meta.csv');

catch errorInfo
    % throw warning if there was an error during import
    warning(['  An error occurred while importing meta.csv. ',...
             '  Error details: ', errorInfo.message]);

    % exit script if there was an error
    return; 
end




%% import data from trials
disp('import data from trials')

% get path to current directory where this matlab script is being
% executed
scriptPathChar = pwd;  

% build full path to "_trials" folder, assuming it's a subdirectory
% of current directory
dataRootPathChar = fullfile(scriptPathChar, '_trials');

% get a list of all directories starting with "trial" under data root
% path. NOTE: they are not sorted correctly at this point
trialDirsStruct = dir(fullfile(dataRootPathChar, 'trial*'));

% get trial number strings from directory names
%     assumes directory name starts with "trial"
trialNumberCell = {trialDirsStruct.name};

% get numeric part from each trial string and convert to numbers, still
% usorted, i.e. 1, 10, 11, 12 ...
trialNumbersDouble = cellfun(@(x) str2double(x(6:end)), trialNumberCell);

% sort numbers
[~, sortedIndicesDouble] = sort(trialNumbersDouble);

% use sorted indices to reorder trial directories in numeric order, while
% not strictly required, this ensures consistent handling of trials in
% subsequent operations
sortedTrialDirsStruct = trialDirsStruct(sortedIndicesDouble);

% initialize a structure to store data tables for each trial
DS = struct();

% loop through each sorted trial directory and populate DS data structure
for i = 1:length(sortedTrialDirsStruct)

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % placeholder structures for each file in a trial
    currentTrialDataStruct = struct('omegaTable', [], ...
                                    'arduinoTable', [], ...
                                    'toxiraeTable', [], ...
                                    'vernierTable', []);
    
    % build full file name from parts
    trialPathChar = fullfile(dataRootPathChar, ...
                             sortedTrialDirsStruct(i).name);
    
    % check if '1-preprocessed' folder exists in current trial
    % directory, where 7 indicates it's a directory, 'dir' is
    % recommended
    if exist(fullfile(trialPathChar, '1-preprocessed'), 'dir') == 7

        % get all files and folders in '1-preprocessed' directory
        filesStruct = dir(fullfile(trialPathChar, ...
                                   '1-preprocessed', '*.*'));
        
        % loop through each file found
        for j = 1:length(filesStruct)

            % only process if it's not a directory
            %     since dir command returns "." as current directory,
            %     and ".." as parent directory
            if ~filesStruct(j).isdir

                % create full file path
                filePathChar = fullfile(trialPathChar, ...
                                        '1-preprocessed', ...
                                        filesStruct(j).name);

                try

                    % choose what to do based on name of file
                    switch filesStruct(j).name

                        case 'arduino.tsv'

                            % set up import options and import data
                            arduinoImportOptions = ...
                                delimitedTextImportOptions("NumVariables", 4);
    
                            % specify range and delimiter
                            arduinoImportOptions.DataLines = [4, Inf];
                            arduinoImportOptions.Delimiter = "\t";
    
                            % specify column names and types
                            arduinoImportOptions.VariableNames = ...
                                ["timeMS", "psiaA0", "psiaA1", "psiaA2"];
                            arduinoImportOptions.VariableTypes = ...
                                ["double", "double", "double", "double"];
                            
                            % specify file level properties
                            arduinoImportOptions.ExtraColumnsRule = "ignore";
                            arduinoImportOptions.EmptyLineRule = "read";
    
                            % import data
                            currentTrialDataStruct.arduinoTable = ...
                                readtable(filePathChar, arduinoImportOptions);

                            % report import success
                            disp('    arduino import success')

                        case 'omega.txt'

                            % initialize variables
                            omegaStartRowDouble = 2;
                            
                            % format for each line of text
                            omegaFormatSpecificationChar = ...
                                '%f %f %f %f %s%[^\n\r]';
                            
                            % open text file
                            omegaFileIDDouble = fopen(filePathChar,'r');
                            
                            % read columns of data based on format
                            % specified
                            omegaDataCell = ...
                                textscan(omegaFileIDDouble, ...
                                    omegaFormatSpecificationChar, ...
                                    'Delimiter', ' ', ...
                                    'MultipleDelimsAsOne', true, ...
                                    'TextType', 'string', ...
                                    'HeaderLines', omegaStartRowDouble-1, ...
                                    'ReturnOnError', false, ...
                                    'EndOfLine', '\r\n');
                            
                            % close text file
                            fclose(omegaFileIDDouble);
                            
                            % create output variable
                            currentTrialDataStruct.omegaTable = ...
                                table(omegaDataCell{1}, ...
                                      omegaDataCell{2}, ...
                                      omegaDataCell{3}, ...
                                      omegaDataCell{4}, ...
                                      omegaDataCell{5}, ...
                                      'VariableNames', {'absolutePressurePSIA', ...
                                                        'gasTemperatureC', ...
                                                        'volumetricFlowRateRawCCM', ...
                                                        'volumetricFlowRateStandardizedSCCM', ...
                                                        'gasTypeAndStatus'});
                            
                            % remove leading and trailing white spaces from
                            % gasTypeAndStatus column
                            currentTrialDataStruct.omegaTable.gasTypeAndStatus = ...
                                strtrim(currentTrialDataStruct.omegaTable.gasTypeAndStatus);

                            % report import success
                            disp('    omega import success')

                        case 'toxirae.csv'

                            % set up import options and import data
                            toxiraeImportOptions = ...
                                delimitedTextImportOptions("NumVariables", 29, ...
                                                           "Encoding", "UTF-8");
                            
                            % specify to read all lines after header 
                            % with "Inf"
                            toxiraeImportOptions.DataLines = [2, Inf];

                            % specify delimiter
                            toxiraeImportOptions.Delimiter = ",";
                            
                            % specify column names
                            toxiraeImportOptions.VariableNames = ...
                                ["DeviceSerialNo", ...
                                 "LogTime", ...
                                 "LogType", ...
                                 "LogInterval", ...
                                 "Sensor1Type", ...
                                 "Sensor1DisplayUnit", ...
                                 "Sensor1SerialNumber", ...
                                 "Sensor1Status", ...
                                 "Sensor1GasReading", ...
                                 "Sensor1STELReading", ...
                                 "Sensor1TWAReading", ...
                                 "Sensor1LastCal", ...
                                 "Sensor1SpanSetpoint", ...
                                 "Sensor1HighAlarm", ...
                                 "Sensor1LowAlarm", ...
                                 "Sensor1STELAlarm", ...
                                 "Sensor1TWAAlarm", ...
                                 "Sensor1OverrangeThreshold", ...
                                 "UnitStatus", ...
                                 "RunningMode", ...
                                 "LogStartType", ...
                                 "DiagnosticMode", ...
                                 "StopReason", ...
                                 "UserId", ...
                                 "SiteId", ...
                                 "RecordNumber", ...
                                 "SessionStartTime", ...
                                 "SessionStopTime", ...
                                 "FirmwareVersion"];
                            
                            % specify column types
                            toxiraeImportOptions.VariableTypes = ...
                                ["string", ...
                                 "datetime", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "double", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "double", ...
                                 "double", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string", ...
                                 "string"];
                            
                            % specify date-time format for LogTime
                            % column
                            toxiraeImportOptions = ...
                                setvaropts(toxiraeImportOptions, ...
                                           'LogTime', ...
                                           'InputFormat', 'M/dd/yyyy h:mm:ss a');
                            
                            % specify file level properties
                            toxiraeImportOptions.ExtraColumnsRule = "ignore";
                            toxiraeImportOptions.EmptyLineRule = "read";
                            
                            % import data
                            currentTrialDataStruct.toxiraeTable = ...
                                readtable(filePathChar, toxiraeImportOptions);

                            % report import success
                            disp('    toxirae import success')

                        case 'vernier.csv'

                            % since the order of the column variables
                            % varies, i.e., trial8 vs trial9, we need to do
                            % the following

                            % read the table
                            dataTable = ...
                                readtable(filePathChar, ...
                                'VariableNamingRule', 'preserve');
                            
                            % get column names to determine the order
                            colNames = dataTable.Properties.VariableNames;
                            
                            % create a temporary table to store columns in
                            % the desired order
                            tempTable = table();
                            
                            % for each column variable name, find the
                            % corresponding column and store data
                            % accordingly

                            if any(contains(colNames, 'Time(s)'))
                                tempTable.DataSet1Times = ...
                                    dataTable{:, contains(colNames, 'Time(s)')};
                            end % <-- end if

                            if any(contains(colNames, 'Temperature'))
                                tempTable.DataSet1TemperatureC = ...
                                    dataTable{:, contains(colNames, 'Temperature')};
                            end % <-- end if

                            if any(contains(colNames, 'Potential'))
                                tempTable.DataSet1PotentialmV = ...
                                    dataTable{:, contains(colNames, 'Potential')};
                            end % <-- end if

                            if any(contains(colNames, 'Ammonium'))
                                tempTable.DataSet1AmmoniummgL = ...
                                    dataTable{:, contains(colNames, 'Ammonium')};
                            end % <-- end if

                            if any(contains(colNames, 'pH'))
                                tempTable.DataSet1pH = ...
                                    dataTable{:, contains(colNames, 'pH')};
                            end % <-- end if
                        
                            % put the temporary table in the correct
                            % variable order into what will be used in the
                            % data store DS
                            currentTrialDataStruct.vernierTable = tempTable;
                            
                            % report import success
                            disp('    vernier import success');

                        otherwise

                            % throw warning because there should only be
                            % four files in "0-raw" folder
                            warning('Unrecognized file: %s', ...
                                    filesStruct(j).name);

                            % report import failure
                            disp(['    ' filesStruct(j).name ' unrecognized'])

                    end  % <-- end switch filesStruct(j).name

                catch exception

                    % throw warning if there is any problems with
                    % processing file
                    warning('Error processing file: %s\n%s', ...
                            filePathChar, exception.message);

                    % report import failure
                    disp(['    ' filesStruct(j).name ' failure'])

                end % <-- end try

            end  % <-- end if

        end % <-- end for

    else

        % throw warning that folder was not found
        warning(['Folder "1-preprocessed" not found in directory: %s. ', ...
                 'Adding empty entry for this trial.'], ...
                trialPathChar);

    end % <-- end if 

    % store data for this trial number %d = i 
    DS.(sprintf('trial%d', i)) = currentTrialDataStruct;

end % <-- end for 



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% remove unused data from
disp('remove unused data')

% get field names of all trials in structure
trialNamesCell = fieldnames(DS); 

% loop over each trial
for i = 1:length(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % check if table 'omegaTable' exists within current trial
    if isfield(DS.(trialNameChar), 'omegaTable')

        % get omegaTable from current trial into T
        T = DS.(trialNameChar).omegaTable;
        
        % keep only specified columns
        T = T(:, {'absolutePressurePSIA', ...
                  'gasTemperatureC', ...
                  'volumetricFlowRateRawCCM', ...
                  'volumetricFlowRateStandardizedSCCM'});
        
        % update table in structure
        DS.(trialNameChar).omegaTable = T;

    end % <-- end if

    % check if table 'toxiraeTable' exists within current trial
    if isfield(DS.(trialNameChar), 'toxiraeTable')

        % get current trial toxirae table
        T = DS.(trialNameChar).toxiraeTable;
        
        % keep only specified columns
        T = T(:, {'LogTime', ...
                  'Sensor1GasReading'});
        
        % update table in structure
        DS.(trialNameChar).toxiraeTable = T;

    end % <-- end if

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% prepare arduino data with dateTime using table M
disp('prepare arduino data with dateTime using table M');

% instead of trial names, we will now loop over row indices in M
numTrialsDouble = size(M, 1); 

% loop over each trial
for i = 1:numTrialsDouble

    % get arduino beginning dateTime
    arduinoBegDateTime = M.arduinoBeg(i);
    
    % each row in M corresponds to a trial in DS
    trialNameChar = ['trial', num2str(i)]; 
    
    % check if table 'arduinoTable' exists within current trial
    if isfield(DS.(trialNameChar), 'arduinoTable')

        % get arduino table for current trial
        T = DS.(trialNameChar).arduinoTable;
        
        % convert timeMS column to duration
        timeDuration = milliseconds(T.timeMS);
        
        % generate datetime array using converted duration
        arduinoDateTime = arduinoBegDateTime + timeDuration;
        
        % add datetime array as a new column to table
        T.dateTime = arduinoDateTime;
        
        % reorder columns to make dateTime first column
        T = [T(:,'dateTime'), ...
             T(:, setdiff(T.Properties.VariableNames, {'dateTime', 'timeMS'}))];
        
        % update table in structure
        DS.(trialNameChar).arduinoTable = T;

    end % <-- end if

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% prepare omega data with dateTime using table M
disp('prepare omega data with dateTime using table M');

% loop over trials
numTrialsDouble = size(M, 1); 

% loop over each trial
for i = 1:numTrialsDouble

    % get starting time omega device began recording
    omegaBegDateTime = M.omegaBeg(i);
    
    % each row in M corresponds to a trial in DS
    trialNameChar = ['trial', num2str(i)]; 
    
    % check if table 'omegaTable' exists within current trial
    if isfield(DS.(trialNameChar), 'omegaTable')

        % get omega table for current trial
        T = DS.(trialNameChar).omegaTable;
        
        % get number of rows in table
        numRows = height(T); 

        % 500 ms increment
        incrementDuration = milliseconds(500);

        % generate datetime array
        omegaDateTime = ...
            omegaBegDateTime + ...
            (0 : incrementDuration : (numRows-1)*incrementDuration)';
        
        % add datetime array as a new column to table
        T.dateTime = omegaDateTime;
        
        % reorder columns by moving 'dateTime' as first column because the
        % timetable function requires datetime to be first column in
        % subsequent operations
        T = [T(:, 'dateTime'), ...
             T(:, setdiff(T.Properties.VariableNames, 'dateTime'))];
        
        % update table in structure
        DS.(trialNameChar).omegaTable = T;

    end % <-- end if

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% prepare toxirae data with dateTime using table M
disp('prepare toxirae data with dateTime using table M')

% get field names of all trials in structure
trialNamesCell = fieldnames(DS); 

% input dateTime format
inputFormatChar = 'MM/dd/yyyy h:mm:ss a'; 

% output dateTime format
outputFormatChar = 'yyyy-MM-dd HH:mm:ss.SSS';

% original toxirae LogTime format is reverse chronlogical order, however,
% for synchronizng all timetables we need to convert LogTime format
% and reverse order so it becomes correct chronological order
for i = 1:length(trialNamesCell)

    % get current trial
    trialNameChar = trialNamesCell{i};
    
    % check if table 'toxiraeTable' exists within current trial
    if isfield(DS.(trialNameChar), 'toxiraeTable')
        
        % get toxirae table for current trial
        T = DS.(trialNameChar).toxiraeTable;
        
        % convert LogTime to datetime format
        T.dateTime = datetime(T.LogTime, ...
                              'InputFormat', inputFormatChar, ...
                              'Format', outputFormatChar);
        
        % rearrange columns to make dateTime first column
        T = T(:, {'dateTime', 'Sensor1GasReading'});
        
        % reverse order of rows for T
        T = flipud(T);
        
        % update table in DS
        DS.(trialNameChar).toxiraeTable = T;

    end % <-- end if

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% prepare vernier data with dateTime using table M
disp('prepare vernier data with dateTime using table M');

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % get starting time vernier device began recording 
    vernierBegDateTime = M.vernierBeg(i);
    
    % check if table 'vernierTable' exists within current trial
    if isfield(DS.(trialNameChar), 'vernierTable')

        % get vernier table for current trial
        T = DS.(trialNameChar).vernierTable;
        
        % generate dateTime based on DataSet1Times and starting time
        T.dateTime = vernierBegDateTime + seconds(T.DataSet1Times);
        
        % rearrange columns to make dateTime first column
        T = T(:, [{'dateTime'}, ...
                  setdiff(T.Properties.VariableNames, 'dateTime')]);
        
        % remove DataSet1Times column
        T = removevars(T, 'DataSet1Times');
        
        % update table in structure DS
        DS.(trialNameChar).vernierTable = T;

    end % <-- end if

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% convert each table in each trial to timetable
disp('convert each table in each trial to timetable')

% we are doing this so that we can sync all tables together later for
% each trial

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % convert tables to timetables and store as new fields in DS
    DS.(trialNameChar).arduinoTT = ...
        table2timetable(DS.(trialNameChar).arduinoTable, 'RowTimes', 'dateTime');
    DS.(trialNameChar).omegaTT   = ...
        table2timetable(DS.(trialNameChar).omegaTable,   'RowTimes', 'dateTime');
    DS.(trialNameChar).toxiraeTT = ...
        table2timetable(DS.(trialNameChar).toxiraeTable, 'RowTimes', 'dateTime');
    DS.(trialNameChar).vernierTT = ...
        table2timetable(DS.(trialNameChar).vernierTable, 'RowTimes', 'dateTime');

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% calculate average deviation of time for arduinoTT
disp('calculate average deviation of time for arduinoTT');

% calculate average deviation between consecutive time stamps for arduinoTT
% for each trial and then get overall average and standard deviation
% across trials. to determine if deviation lies within range of 500
% ms (+/-) 25 ms

% initialize a counter for total number of arduinoTT lines across all trials
totalArduinoTTLines = 0;

% get list of trials
trialNamesCell = fieldnames(DS);

% initialize a cell array to temporarily store time differences for each
% trial
timeDifferencesCell = cell(numel(trialNamesCell), 1);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % get dateTime from arduino timetable for this trial
    timeStamps = DS.(trialNameChar).arduinoTT.dateTime;

    % update the total number of arduinoTT lines
    totalArduinoTTLines = totalArduinoTTLines + length(timeStamps);
    
    % compute differences between consecutive timestamps in seconds
    timeDifferences = diff(timeStamps);
    timeDifferencesInSeconds = seconds(timeDifferences);
    
    % store time differences in current cell
    timeDifferencesCell{i} = timeDifferencesInSeconds;

end % <-- end for

% concatenate all time differences into one array
totalTimeDifferences = vertcat(timeDifferencesCell{:});

% calculate average and standard deviation of time differences
% across all trials
avgSamplingInterval = mean(totalTimeDifferences);
stdSamplingInterval = std(totalTimeDifferences);

% convert to milliseconds for display
avgSamplingInterval_ms = avgSamplingInterval * 1000;
stdSamplingInterval_ms = stdSamplingInterval * 1000;

% display results in desired format
fprintf('  average sampling interval across all trials: %.2f (+/- %.2f) ms\n', ...
        avgSamplingInterval_ms, stdSamplingInterval_ms);
disp(['    arduinoTT lines count, n = ', num2str(totalArduinoTTLines) ]);


%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% resample arduino data for each trial
disp('resample arduino data for each trial')

% we resample arduinoTT in DS to a regular 500 ms interval, for easier
% synchronization with other regularly sampled devices, this is acceptable
% because arduino is already sampled at 504.81 (+/- 0.47) ms

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % get arduino timetable for this trial
    irregularArduinoTT = DS.(trialNameChar).arduinoTT;
    
    % resample to a regular interval of 500 ms using linear interpolation
    regularArduinoTT = ...
        retime(irregularArduinoTT, 'regular', 'linear', 'TimeStep', seconds(0.5));
    
    % store regularized timetable back into struct
    DS.(trialNameChar).arduinoTT = regularArduinoTT;

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% upsample toxirae data to 500 ms interval using linear interpolation
disp('upsample toxirae data to 500 ms interval using linear interpolation')

% toxirae device samples data every 1 second by default. in order to
% align its sampling rate with other devices, we need to upsample its data
% to 500 ms intervals
%
% toxirae device samples whole numbers (e.g., 1, 2, 3), during
% interpolation, a value between 1 and 2 becomes 1.5, which is a linear
% interpolation artifact

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % ensure unique timestamps in toxiraeTT
    %     - duplicate timestamps are highly unlikely, to ensure data
    %       consistency, we check and remove any duplicates
    %     - 'unique' function identifies unique dateTime and returns their
    %       indices (idx)
    %     - 'stable' ensures original order of data is preserved
    [~, idx] = unique(DS.(trialNameChar).toxiraeTT.dateTime, 'stable');
    
    % determine number of non-unique (duplicate) timestamps
    numDuplicates = ...
        length(DS.(trialNameChar).toxiraeTT.dateTime) - length(idx);
    
    % display if there are any non-unique timestamps for current trial
    if (numDuplicates > 0)
        fprintf('  Trial %s has %d duplicate timestamps.\n', ...
                trialNameChar, numDuplicates);
    end % <-- end if

    % use indices from 'unique' function, to only keep unique rows from
    % original data
    DS.(trialNameChar).toxiraeTT = DS.(trialNameChar).toxiraeTT(idx,:);
    
    % create new time vector for 500 ms intervals, here we are getting the
    % first and last time and then spacing every 500 ms
    newTimeVector = ...
        min(DS.(trialNameChar).toxiraeTT.dateTime) : ...
        seconds(0.5) : ...
        max(DS.(trialNameChar).toxiraeTT.dateTime) ;
    
    % ensure newTimeVector is unique, highly unlikely, but just in case
    newTimeVector = unique(newTimeVector);
    
    % remember we are upscaling, we do this by adjust for potential missing
    % values by syncing to newly created time vector
    %     - 'synchronize' function aligns two timetables by their row times
    %     - first input is original toxirae timetable we want to
    %       upscale at a sample rate of 1 second
    %     - second input is new time vector at a sample rate of 500 ms
    %     - 'union' method will synchronize uses linear interpolation to
    %       resample data from input timetables to output row
    %       times
    %     - 'linear' will fill in any missing data in first
    %       timetable using linear interpolation based on neighboring
    %       values

    DS.(trialNameChar).toxiraeTT = ...
        synchronize(DS.(trialNameChar).toxiraeTT, ...
                    timetable(newTimeVector'), ...
                    'union', ...
                    'linear');
    
    % retime function to adjust timetable to regular time intervals,
    % this is not really needed, but just in case
    %     - 'regular' specifies that timetable should be adjusted to
    %        have regular time intervals
    %     - 'linear' is used to fill in any missing data with linear
    %       interpolation
    %     - 'TimeStep' with seconds(0.5) specifies desired time interval as
    %       500 milliseconds or 0.5 seconds
    DS.(trialNameChar).toxiraeTT = ...
        retime(DS.(trialNameChar).toxiraeTT, ...
               'regular', ...
               'linear', ...
               'TimeStep', seconds(0.5));

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% save each timeTable for each trial to individual csv files
disp('save each timeTable for each trial to individual csv files');

% list of timetables we want to save
timetablesToSave = {'arduinoTT', 'omegaTT', 'toxiraeTT', 'vernierTT'};

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % check if '2-processed' exists in current trial's directory
    currentProcessedDir = ...
        fullfile(dataRootPathChar, trialNameChar, '2-processed');

    if ~exist(currentProcessedDir, 'dir')
        
        % if it doesn't exist, create it
        mkdir(currentProcessedDir); 

    end % <-- end if
    
    % loop over each timetable in timetablesToSave list
    for j = 1:length(timetablesToSave)

        % get current table
        currentTT = timetablesToSave{j};
        
        % confirm that current timetable exists in current trial
        if isfield(DS.(trialNameChar), currentTT)

            % remove 'TT' suffix from filename
            baseName = strrep(currentTT, 'TT', '');
            
            % create full path and filename for CSV
            fileName = fullfile(currentProcessedDir, [baseName, '.csv']);

            % attempt to save timetable to CSV
            try

                % write timetable to a CSV
                writetimetable(DS.(trialNameChar).(currentTT), fileName);
                
                % post-process CSV to remove "NaN"s
                removeNaNsFromCSV(fileName)

                % report export success
                disp(['    ', baseName, ' export success'])

            catch ME

                % Report error if there's an issue exporting
                disp(['    Error exporting ', baseName, ': ', ME.message]);

            end % <-- end try

        end % <-- end if

    end % <-- end for

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% combine and synchronize data for all devices for that trial
disp('combine and synchronize data for all devices for that trial')

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % ensure each timetable is sorted and check for missing dateTime values
    timetableNames = {'arduinoTT', 'omegaTT', 'vernierTT', 'toxiraeTT'};

    % loop through each timetable to sort and check dateTime
    for ttName = timetableNames

        % get current timetable
        currentTT = DS.(trialNameChar).(ttName{1});
        
        % sort timetable based on dateTime
        currentTT = sortrows(currentTT, 'dateTime');
        
        % check for missing dateTime values and throw error if found
        if any(ismissing(currentTT.dateTime))

            error(['    Missing dateTime values in ' ...
                   ttName{1} ' of ' trialNameChar]);

        end % <-- end if
        
        % update timetable in struct
        DS.(trialNameChar).(ttName{1}) = currentTT;

    end % <-- end for
    
    try
        
        % synchronize all time tables for this trial
        % use 'union' to ensure all times are considered
        synchronizedTimeTable = ...
            synchronize(DS.(trialNameChar).arduinoTT, ...
                        DS.(trialNameChar).omegaTT, ...
                        DS.(trialNameChar).vernierTT, ...
                        DS.(trialNameChar).toxiraeTT, ...
                        'union');

        % store synchronized data back into main structure
        DS.(trialNameChar).synchronizedTT = synchronizedTimeTable;

        % report synchronized success
        disp('    synchronized success')
        
    catch ME

        % handle specific errors related to timetable synchronization
        if strcmp(ME.identifier, 'MATLAB:timetable:synchronize:InvalidTimes')
            
            % report where error found
            disp(['Found an issue with dateTime values in trial: ' trialNameChar]);

            % to provide more detailed error information
            rethrow(ME);  

        else
            
            % for all other errors, rethrow them
            rethrow(ME);

        end % <-- end if

    end % <-- end try

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% save combined and synchronized data to csv files
disp('save combined and synchronized data to csv files')

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % determine path for '3-synchronized' in current trial's directory
    currentSynchronizedDir = ...
        fullfile(dataRootPathChar, trialNameChar, '3-synchronized');

    % check for existence and create directory if not found
    if ~exist(currentSynchronizedDir, 'dir')
        
        % if it doesn't exist, create it
        mkdir(currentSynchronizedDir); 
    end
    
    % retrieve synchronized timetable from dataset
    synchronizedTimeTable = DS.(trialNameChar).synchronizedTT;

    % construct path and filename for saving CSV
    fileName = fullfile(currentSynchronizedDir, 'synchronized.csv');

    % try to save timetable and handle potential errors
    try

        % save timetable directly into a CSV file
        writetimetable(synchronizedTimeTable, fileName);
        
        % post-process CSV to remove "NaN"s
        removeNaNsFromCSV(fileName)

        % report export success
        disp('    synchronized export success');

    catch ME

        % report error if there's an issue exporting
        disp(['    Error exporting synchronized: ', ME.message]);

    end % <-- end try

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% for each trial trim to only include experiment rows using table M
disp('for each trial trim to only include experiment rows using table M');

% we are trimming to when experiment starts and stops

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i}; 
    
    % get start and stop times directly from M
    startTime = M.phase1VacOffBeg(i);
    stopTime = M.phase3VacOffEnd(i);
    
    % get synchronizedTT for current trial
    synchronizedTT = DS.(trialNameChar).synchronizedTT;
    
    % subset synchronizedTT to only include rows between start and stop
    % times
    subsetTT = ...
        synchronizedTT(startTime <= synchronizedTT.dateTime ...
                       & synchronizedTT.dateTime <= stopTime, :);
    
    % save subsetted timetable to structure
    DS.(trialNameChar).experimentTT = subsetTT;

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% data cleanup for broken or out of range values
disp('data cleanup for broken or out of range values')

% due to broken vernier liquid ammonium probe for trial 1 change all
% vernier temperature readings to zero
DS.trial1.experimentTT.DataSet1TemperatureC(:) = 0;

% unknown cause of NaNs for ammonia sensor
% locate NaN values in specific field
nanIndices = isnan(DS.trial11.experimentTT.Sensor1GasReading);
% replace NaN values with zeros
DS.trial11.experimentTT.Sensor1GasReading(nanIndices) = 0;


%% fix liquid ammonium sensor out of range values
disp('fix liquid ammonium sensor out of range values')
% liquid ammonium sensor
% https://www.vernier.com/files/manuals/gdx-nh4/gdx-nh4.pdf
%     Range: 
%         1 to 18,000 mg/L (or ppm)
%     Accuracy after calibration (precision): 
%         ±10% of full scale (calibrated 1 to 100 mg/L)
%     pH range: 
%         2–7 (no pH compensation)
%     Temperature range: 
%         0–40°C (no temperature compensation)
%     Electrode slope: 
%         +56 ±4 mV/decade at 25°C
%     Standard voltages, typical: 
%         High (100 mg/L) 116 mV, Low 0 mV (1 mg/L)
%     Electrode resistance: 
%         0.1 to 5 MΩ
% DS.(trialNameChar).experimentTT.DataSet1AmmoniummgL
% DS.(trialNameChar).experimentTT.DataSet1PotentialmV

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % access the ammonium (mg/L) values for the current trial
    ammoniumValues = DS.(trialNameChar).experimentTT.DataSet1AmmoniummgL;
    
    % find number of values outside the range (1, 18000)
    ammoniumOutOfBound = ammoniumValues < 1 | ammoniumValues > 18000;
    
    % report found values out of range
    disp(['    found ', num2str(sum(ammoniumOutOfBound)), ...
          ' values for DataSet1AmmoniummgL']);
    
    % set values outside the range (1, 18000) to NaN
    ammoniumValues(ammoniumOutOfBound) = NaN;
    
    % assign the modified values back to the structure
    DS.(trialNameChar).experimentTT.DataSet1AmmoniummgL = ammoniumValues;
    
    % access the Potential (mV) values for the current trial
    potentialValues = DS.(trialNameChar).experimentTT.DataSet1PotentialmV;
    
    % find number of values outside the range (0, 116)
    potentialOutOfBound = potentialValues < 0 | potentialValues > 116;
    
    % report found values out of range
    disp(['    found ', num2str(sum(potentialOutOfBound)), ...
          ' values for DataSet1PotentialmV out of range']);
    
    % set values outside the range (0, 116) to NaN
    potentialValues(potentialOutOfBound) = NaN;
    
    % assign the modified values back to the structure
    DS.(trialNameChar).experimentTT.DataSet1PotentialmV = potentialValues;

end




%% fix liquid pH sensor out of range values
disp('fix liquid pH sensor out of range values')
% liquid pH sensor
% https://www.vernier.com/files/manuals/ph-bta/ph-bta.pdf
%     Range: 
%         pH 0–14
%     Response time: 
%         90% of final reading in 1 second in a buffer
%     Temperature range: 
%         5 to 80°C (readings not compensated)
%     Accuracy: 
%         ± 0.2 pH units
%     Isopotential pH:
%         pH 7 (point at which temperature has no effect)
%     Default calibration values: 
%         slope: –3.838; intercept: 13.720;
% DS.(trialNameChar).experimentTT.DataSet1pH

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % access the pH values for the current trial
    pHValues = DS.(trialNameChar).experimentTT.DataSet1pH;
    
    % find the number of values outside the range (0, 14)
    pHOutOfBound = pHValues < 0 | pHValues > 14;
    
    % report found values out of range
    disp(['    found ', num2str(sum(pHOutOfBound)), ...
          ' values for pH out of range']);
    
    % set the out-of-range values to NaN
    pHValues(pHOutOfBound) = NaN;
    
    % assign the modified values back to the structure
    DS.(trialNameChar).experimentTT.DataSet1pH = pHValues;

end



%% fix liquid temperature sensor out of range values
disp('fix liquid temperature sensor out of range values')

% liquid temperature sensor
% https://www.vernier.com/files/manuals/tmp-bta/tmp-bta.pdf
%     Temperature range: 
%         –40 to 135°C (–40 to 275°F)
%     Temperature sensor: 
%         20 kΩ NTC Thermistor
%     Accuracy: 
%         ±0.2°C at 0°C, ±0.5°C at 100°C
%     Response time (time for 90% change in reading): 
%         10 seconds (in water, with stirring)
% DS.(trialNameChar).experimentTT.DataSet1TemperatureC

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % access the temperature values for the current trial
    tempValues = DS.(trialNameChar).experimentTT.DataSet1TemperatureC;
    
    % find the number of values outside the range (-40, 135)
    tempOutOfBound = tempValues < -40 | tempValues > 135;
    
    % report found values out of range
    disp(['    found ', num2str(sum(tempOutOfBound)), ...
          ' values for Temperature out of range']);
    
    % set the out-of-range values to NaN
    tempValues(tempOutOfBound) = NaN;
    
    % assign the modified values back to the structure
    DS.(trialNameChar).experimentTT.DataSet1TemperatureC = tempValues;

end % <-- end for




%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% save experiment rows to csv files
disp('save experiment rows to csv files')

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % check if '4-experiment' exists in current trial's directory
    currentExperimentDir = ...
        fullfile(dataRootPathChar, trialNameChar, '4-experiment');

    if ~exist(currentExperimentDir, 'dir')

        % if it doesn't exist, create it
        mkdir(currentExperimentDir); 
    end
    
    % only save experimentTT
    experimentTimeTable = DS.(trialNameChar).experimentTT;

    % form filename for CSV
    fileName = fullfile(currentExperimentDir, 'experiment.csv');
    
    % try to save timetable and handle potential errors
    try

        % write timetable to a CSV file
        writetimetable(experimentTimeTable, fileName);
        
        % post-process CSV to remove "NaN"s
        removeNaNsFromCSV(fileName)

        % report export success
        disp('    experiment export success');

    catch ME

        % report error if there's an issue exporting
        disp(['    Error exporting experiment: ', ME.message]);

    end % <-- end try

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% get subsets for all three phases for each trial
disp('get subsets for all three phases for each trial');

% we breaking apart experiment into three phases based on the
% dateTime data from meta.csv --> M data structure
%     - phase 1: roller pump on, vacuum off
%     - phase 2: roller pump on, vacuum on
%     - phase 3: roller pump on, vacuum off

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % get experimentTT from current trial
    experimentData = DS.(trialNameChar).experimentTT;
    
    % phase 1 extraction based on datetime interval from M
    phase1Begin = M.phase1VacOffBeg(i); % phase 1 start (start of trial)
    phase1End = M.phase1VacOffEnd(i);   % phase 1 stop
    phase1Rows = experimentData.dateTime >= phase1Begin ...
                 & experimentData.dateTime <= phase1End;
    DS.(trialNameChar).phase1TT = experimentData(phase1Rows,:);
    
    % phase 2 extraction based on datetime interval from M
    phase2Begin = M.phase2VacOnBeg(i); % phase 2 start
    phase2End = M.phase2VacOnEnd(i);   % phase 2 stop
    phase2Rows = experimentData.dateTime >= phase2Begin ...
                 & experimentData.dateTime <= phase2End;
    DS.(trialNameChar).phase2TT = experimentData(phase2Rows,:);
    
    % phase 3 extraction based on datetime interval from M
    phase3Begin = M.phase3VacOffBeg(i); % phase 3 start
    phase3End = M.phase3VacOffEnd(i);   % phase 3 stop (end of trial)
    phase3Rows = experimentData.dateTime >= phase3Begin ...
                 & experimentData.dateTime <= phase3End;
    DS.(trialNameChar).phase3TT = experimentData(phase3Rows,:);

end % <-- end for




%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% preparation finished
disp('====preparation finished====')



%% STATISTICS
%  ------------------------------------------------------------------------



%% statistics started
disp('====statistics started====')




%% get statistics for all three phases for each trial
disp('get statistics for all three phases for each trial')

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % get statistics for each phase and store them in DS
    DS.(trialNameChar).phase1Stats = descStat(DS.(trialNameChar).phase1TT);
    DS.(trialNameChar).phase2Stats = descStat(DS.(trialNameChar).phase2TT);
    DS.(trialNameChar).phase3Stats = descStat(DS.(trialNameChar).phase3TT);

end



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% export phase 1 to 3 data and statistics
disp('export phase 1 to 3 data and statistics')

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])

    % construct path to 5-statistics directory for current trial
    currentStatsDir = fullfile(dataRootPathChar, ...
                               trialNameChar, ...
                               '5-statistics');
                           
    % create 5-statistics directory if it doesn't exist
    if ~exist(currentStatsDir, 'dir')

        mkdir(currentStatsDir);

    end % <-- end if
    
    % attempt to save statistics for each phase into CSVs
    try

        for phaseNum = 1:3

            % save raw phase data
            phaseDataName = strcat('phase', num2str(phaseNum), 'TT');
            phaseData = DS.(trialNameChar).(phaseDataName);
            csvFileName = ...
                fullfile(currentStatsDir, ...
                         strcat('phase', num2str(phaseNum), '.csv'));
            
            % write CSV
            writetimetable(phaseData, csvFileName);
            
            % post-process CSV to remove "NaN"s
            removeNaNsFromCSV(csvFileName);

            % report export success
            disp(['    ', strcat('phase', num2str(phaseNum)), ...
                  ' export success']);
            
            % save phase statistics, "S" in "Stats" should be uppercase
            phaseStatsName = strcat('phase', num2str(phaseNum), 'Stats');
            phaseStats = DS.(trialNameChar).(phaseStatsName);

            % prepare to add "stat" (should be lowercase) column name into
            % CSV file, we need to do this because MATLAB does not
            % normally include row variable names, we want this:
            %     CSV file contents:
            %         stat,psiaA0,...
            %         min,...
            %         max,...
            %         :
            phaseStats = addvars(phaseStats, ...
                                 phaseStats.Properties.RowNames, ...
                                 'Before', 'psiaA0', ...
                                 'NewVariableNames', 'stat');

            % NOTE lowercase filename preference for
            % "phase(phaseNum)stats.csv"
            csvStatsFileName = ...
                fullfile(currentStatsDir, ...
                         strcat('phase', num2str(phaseNum), 'stats.csv'));
            
            % export CSV file
            writetable(phaseStats, csvStatsFileName);
            
            % post-process CSV to remove "NaN"s
            removeNaNsFromCSV(csvStatsFileName);

            % report export success
            disp(['    ', strcat('phase', num2str(phaseNum), 'stats'), ...
                  ' export success']);

        end % <-- end for

    catch ME

        % report error if there's an issue exporting
        disp(['    Error exporting trial: ', trialNameChar, ...
              '. Details: ', ME.message]);

    end % <-- end try-catch

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% data integrity check
disp('data integrity check')

% to verify presence of essential fields in DS structure for
% statistical analysis

% expected fields in each trial
expectedFields = {'experimentTT', 'phase1TT', 'phase2TT', 'phase3TT', ...
                  'phase1Stats', 'phase2Stats', 'phase3Stats'};

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    % check if trial exists in DS
    if ~isfield(DS, trialNameChar)

        error(['  ', trialNameChar, ' is missing from DS!']);

    end % <-- end if
    
    % get current trial
    currentTrial = DS.(trialNameChar);
    
    % loop through expected fields
    for j = 1:length(expectedFields)

        % Check if field exists in current trial
        if ~isfield(currentTrial, expectedFields{j})

            error(['    field ', expectedFields{j}, ...
                   ' is missing from ', trialNameChar, '!']);
        else

            % report data integrity check success
            disp(['    ', expectedFields{j}, ' integrity check success'])

        end % <-- end if

    end % <-- end for

end % <-- end for



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% count NaNs for each trial and phase
disp('count NaNs for each trial and phase')

% NaNs will cause problems with some statistics functions

% get list of trials
trialNamesCell = fieldnames(DS);

% initialize a count for NaN values
totalNaNCount = 0;

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i), ': Counting NaNs for ', trialNameChar]);

    for phaseNum = 1:3
        
        phaseDataName = strcat('phase', num2str(phaseNum), 'TT');
        phaseData = DS.(trialNameChar).(phaseDataName);

        % count NaN values in current phase's gas reading
        currentNaNCount = sum(isnan(phaseData.Sensor1GasReading));

        % display NaN count for current phase
        disp(['    phase ', num2str(phaseNum), ...
              ': ', num2str(currentNaNCount), ' NaNs']);

        % update total NaN count
        totalNaNCount = totalNaNCount + currentNaNCount;

    end % <-- end for

end % <-- end for

% display total NaN count
disp(['  Total NaNs across all trials and phases: ', ...
      num2str(totalNaNCount)]);



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;



%% get duration for each phase
disp('get duration for each phase')

% get list of trials
trialNamesCell = fieldnames(DS);

% Initialize a matrix to store all durations
allDurations = strings(numel(trialNamesCell), 3); % assuming there are 3 phases

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    for phaseNum = 1:3
        % create phase data name based on current phaseNum
        phaseDataName = strcat('phase', num2str(phaseNum), 'TT');
        
        % get specific phase data based on current trial and phase
        phaseData = DS.(trialNameChar).(phaseDataName);

        % get dateTime values from timetable
        dateTimeValues = phaseData.dateTime;

        % get start and end times
        startTime = dateTimeValues(1);
        endTime = dateTimeValues(end);
        
        % get duration of phase
        duration = endTime - startTime;
        
        % store duration in the matrix
        allDurations(i, phaseNum) = char(duration);
        
        % display duration of current phase for current trial
        disp(['    phase', num2str(phaseNum), ': ', char(duration), ' (HH:mm:ss)']);
    end
end

% Convert the matrix to a table
durationTable = array2table(allDurations, 'VariableNames', {'phase1duration', 'phase2duration', 'phase3duration'});

% Add the trial column to the table
trialNumbers = (1:numel(trialNamesCell))'; % Creates a column vector
durationTable = addvars(durationTable, trialNumbers, 'Before', 'phase1duration', 'NewVariableNames', 'trial');

% Write the table to a CSV file
writetable(durationTable, 'duration.csv');



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;


%% get summary for phase 2
disp('get summary for phase 2')

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)
    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    for phaseNum = 2
        % create phase data name based on current phaseNum Stats
        phaseDataName = strcat('phase', num2str(phaseNum), 'Stats');
        
        % get mean and standard deviation values from phaseDataName
        meanRow = DS.(trialNameChar).(phaseDataName)('mean', :);
        stdRow = DS.(trialNameChar).(phaseDataName)('std', :);

        % get variable names (column names) from the table
        columnNames = meanRow.Properties.VariableNames;
        
        % loop through each column variable and display its mean and standard deviation
        for j = 1:numel(columnNames)
            columnName = columnNames{j};
            meanValue = meanRow.(columnName);
            stdValue = stdRow.(columnName);
            
            % Convert NaN to 'NaN' for display, else round to 2 decimal places
            if isnan(meanValue)
                meanValueStr = 'NaN';
            else
                meanValueStr = sprintf('%.2f', meanValue);
            end
            
            if isnan(stdValue)
                stdValueStr = 'NaN';
            else
                stdValueStr = sprintf('%.3f', stdValue);
            end

            disp(['    ', columnName, ': ', meanValueStr, ' ± ', stdValueStr]);
        end
    end
end



%% cleanup workspace
disp('  cleanup workspace')

% debug clear all variables except listed
clearvars -except dataRootPathChar ...
                  DS ...
                  M ...
                  scriptPathChar ...
                  sortedTrialDirsStruct ;


%% get summary table for phase 2
disp('get summary table phase 2')

% get list of trials
trialNamesCell = fieldnames(DS);

% get variable names (column names) from first trial for reference
columnNames = DS.(trialNamesCell{1}).phase2Stats.Properties.VariableNames;

% prepare new variable names
varNames = strcat('phase2', columnNames);

% initialize dataTable to store formatted values with an extra column for
% "trial"
dataTable = cell(numel(trialNamesCell), numel(columnNames) + 1);

% loop through each trial
for i = 1:numel(trialNamesCell)
    
    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % add trial number to the first column of dataTable
    dataTable{i, 1} = num2str(i);
    
    % get mean and standard deviation values for phase2
    meanRow = DS.(trialNameChar).phase2Stats('mean', :);
    stdRow = DS.(trialNameChar).phase2Stats('std', :);

    % loop through each column variable and store its formatted value in
    % dataTable
    for j = 1:numel(columnNames)

        columnName = columnNames{j};
        meanValue = meanRow.(columnName);
        stdValue = stdRow.(columnName);
        
        % convert NaN to 'NaN' for display, else round to 2 decimal places
        if isnan(meanValue)

            meanValueStr = 'NaN';

        else

            meanValueStr = num2str(meanValue, '%.2f');

        end % <-- end if
        
        if isnan(stdValue)

            stdValueStr = 'NaN';

        else

            stdValueStr = num2str(stdValue, '%.2f');

        end % <-- end if
        
        dataTable{i, j+1} = [meanValueStr, ' ± ', stdValueStr];
    end
end


% we are doing all this just to display the table without any {''} or ""
% omg MATLAB

% add "trial" to start of varNames
varNames = ['trial', varNames];

% convert cell array dataTable into a MATLAB table
summaryTable = cell2table(dataTable, 'VariableNames', varNames);

% convert to string table
summaryTable = convertvars(summaryTable, varNames, 'string');

% capture the output of disp(summaryTable) with strings "value"
outputStr = evalc('disp(summaryTable)');

% replace the quotes with spaces
outputStrWithoutQuotes = strrep(outputStr, '"', ' ');

% display the processed string
disp(outputStrWithoutQuotes);

% overwrite previous summary.csv
writetable(summaryTable, 'summary.csv');



%% comparing phases 
disp('comparing phases')

% compare three phases to assess if there's a significant difference in
% ammonia removal

disp('check for normality')

% use Lilliefors test on ammonia gas meter readings for each phase in each
% trial

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % display current trial number
    disp(['  trial', num2str(i)])
    
    for phaseNum = 1:3

        phaseDataName = strcat('phase', num2str(phaseNum), 'TT');
        phaseData = DS.(trialNameChar).(phaseDataName);
        
        if length(phaseData.Sensor1GasReading) >= 4

            h = lillietest(phaseData.Sensor1GasReading); 

            if h == 1

                disp(['    phase', num2str(phaseNum), ...
                    ' Sensor1GasReading is not normally distributed'])
                
            end % <-- end if

        else

            disp(['    phase', num2str(phaseNum), ' Sensor1GasReading ', ...
                  'has less than 4 valid observations, ' ...
                  'Lilliefors test skipped'])
     
        end % <-- end if

    end % <-- end for

end % <-- end for

% NOTE: all data across trials and phases are not normally distributed



%% use Friedman tests
disp('use Friedman tests')

disp('  compare phase to Sensor1GasReading (ammonia gas in ppm)')

% since we are comparing three phases across different trials, the Friedman
% test is appropriate, as it is non-parametric alternative to repeated
% measures ANOVA

% organize data such that it's in a matrix format where each column
% represents a phase (i.e., phase 1, phase 2, and phase 3) and each row
% represents a trial

numTrials = length(fieldnames(DS));

% pre-allocate space for 3 phases
dataMatrix = zeros(numTrials, 3);

% trial names fetched for the Lilliefors normality test will also be used in
% constructing the dataMatrix for the Friedman test
for i = 1:numTrials

    trialNameChar = trialNamesCell{i};
    dataMatrix(i, 1) = mean(DS.(trialNameChar).phase1TT.Sensor1GasReading);
    dataMatrix(i, 2) = mean(DS.(trialNameChar).phase2TT.Sensor1GasReading);
    dataMatrix(i, 3) = mean(DS.(trialNameChar).phase3TT.Sensor1GasReading);

end % <-- end for


% Friedman test is a non-parametric alternative to repeated measures ANOVA.
% we use it when data does not meet assumptions for a parametric test. 
%     - dataMatrix: matrix where each column represents a phase, and each
%       row represents a trial
%     - 1: ranking of data is done by rows, which compares phases across
%       trials
%     - 'off': suppresses default display of the test statistics and plots
[p, tbl, stats] = friedman(dataMatrix, 1, 'off');

% display friedman table
% loop over rows
fprintf('  %s\n', repmat('-', 1, 72)) % horizontal line
for r = 1:size(tbl, 1)

    fprintf('  ') % indent

    % loop over columns
    for c = 1:size(tbl, 2)

        cell_content = tbl{r, c};
        
        % check if the content is a string (char array)
        if ischar(cell_content)

            fprintf('%-12s', cell_content)

        % check if the content is a numeric value
        elseif isnumeric(cell_content)

            if isempty(cell_content)

                fprintf('%-12s', ' ')

            else

                fprintf('%-12.4f', cell_content)

            end % <-- end if

        end % <-- end if

    end % <-- end for

    % new line after printing all columns of the current row
    fprintf('\n'); 

end % <-- end for
fprintf('  %s\n', repmat('-', 1, 72)) % horizontal line


% Post-Hoc Analysis with Wilcoxon Signed-Rank Test

% check to see if p value from Friedman test is significant (typically less
% than 0.05), which would mean that at least one of phases is significantly
% different from others. to determine which phases are different, we can
% conduct post-hoc pairwise comparisons using the Wilcoxon signed-rank test

% NOTE: since we will be conducting multiple comparisons, we need to
% correct for this to avoid inflated Type I errors, we will use Bonferroni
% correction for this. therefore, we will perform pairwise comparisons,
% where we are trying to determine which pairs of phases have significant
% differences in their means
% 
% our primary interest is phase 2, so if h12 and/or h23 are 1, that
% indicates phase 2 is significantly different from either phase 1 or phase
% 3, respectively.

if p < 0.05

    % adjusted alpha level for Bonferroni correction (3 comparisons)
    alpha_adjusted = 0.05 / 3;

    % pairwise comparison between phase 1 and phase 2
    [p12, h12] = signrank(dataMatrix(:,1), dataMatrix(:,2), ...
                          'alpha', alpha_adjusted);
    
    % pairwise comparison between phase 1 and phase 3
    [p13, h13] = signrank(dataMatrix(:,1), dataMatrix(:,3), ...
                          'alpha', alpha_adjusted);
    
    % pairwise comparison between phase 2 and phase 3
    [p23, h23] = signrank(dataMatrix(:,2), dataMatrix(:,3), ...
                          'alpha', alpha_adjusted);
    
    % display significant differences (if any)

    if h12 == 1

        disp('  phase 1 and phase 2 are significantly different.');

    end % <-- end if

    if h13 == 1

        disp('  phase 1 and phase 3 are significantly different.');

    end % <-- end if

    if h23 == 1
    
        disp('  phase 2 and phase 3 are significantly different.');

    end % <-- end if

end % <-- end if

% statistical analyses in code suggest that, based on the
% Sensor1GasReading data:
% 
% - phase 1 and phase 2 have significantly different gas readings 
% - phase 1 and phase 3 have significantly different gas readings 
% - No significant difference was reported between phase 2 and phase 3



%% exploratory data analysis (EDA)
disp('exploratory data analysis (EDA)')

disp('  compare trials to Sensor1GasReading (ammonia gas in ppm)')

% visualize ammonia readings across phases and trials

% Sensor1GasReading contains ammonia readings

% number of trials
numTrials = length(fieldnames(DS));

% plot ammonia readings
figure;
for i = 1:numTrials

    subplot(4,4,i, "replace"); 
    
    % get readings for three phases
    phase1 = DS.(['trial', num2str(i)]).phase1TT.Sensor1GasReading;
    phase2 = DS.(['trial', num2str(i)]).phase2TT.Sensor1GasReading;
    phase3 = DS.(['trial', num2str(i)]).phase3TT.Sensor1GasReading;
    
    % convert each phase data into a cell array, and then concatenate them
    allPhases = [{phase1}; {phase2}; {phase3}];

    % Check if each phase is numeric and print its size
    for j = 1:length(allPhases)

        if isnumeric(allPhases{j})
        
            numericStatus = 'true';

        else
            
            numericStatus = 'false';

        end % <--end if
        
        disp(['  Is phase ', num2str(j), ' numeric? ', numericStatus]);

        disp(['    Size of phase ', num2str(j), ': ', ...
              num2str(size(allPhases{j}))]);

    end % <--end for

    % create a grouping variable
    group = [ones(size(phase1)); 2*ones(size(phase2)); 3*ones(size(phase3))];

    % plot using boxplot
    boxplot(cell2mat(allPhases), group, "Widths", 0.25);
    ylabel('Ammonia (PPM)');
    title(['Trial ' num2str(i)]);
    
end % <--end for

% save current figure
saveCurrentFigureAsImage('phases_for_each_trial_vs_ammonia_gas', ...
    7.5, 7.5);



%% correlation analysis
disp('correlation analysis')

% number of trials
numTrials = length(fieldnames(DS));

% preallocate arrays to store flow rates for each phase
flowRatesPhase1 = zeros(1, numTrials);
flowRatesPhase2 = zeros(1, numTrials);
flowRatesPhase3 = zeros(1, numTrials);

% preallocate arrays to store mean ammonia readings for each phase
meanAmmoniaPhase1 = zeros(1, numTrials);
meanAmmoniaPhase2 = zeros(1, numTrials);
meanAmmoniaPhase3 = zeros(1, numTrials);

for i = 1:numTrials

    flowRatesPhase1(i) = ...
        mean(DS.(['trial', num2str(i)]).phase1TT.volumetricFlowRateStandardizedSCCM);
    flowRatesPhase2(i) = ...
        mean(DS.(['trial', num2str(i)]).phase2TT.volumetricFlowRateStandardizedSCCM);
    flowRatesPhase3(i) = ...
        mean(DS.(['trial', num2str(i)]).phase3TT.volumetricFlowRateStandardizedSCCM);

    meanAmmoniaPhase1(i) = ...
        mean(DS.(['trial', num2str(i)]).phase1TT.Sensor1GasReading);
    meanAmmoniaPhase2(i) = ...
        mean(DS.(['trial', num2str(i)]).phase2TT.Sensor1GasReading);
    meanAmmoniaPhase3(i) = ...
        mean(DS.(['trial', num2str(i)]).phase3TT.Sensor1GasReading);

end % <-- end for

% linear or rank correlation
R1 = corr(flowRatesPhase1', meanAmmoniaPhase1');
R2 = corr(flowRatesPhase2', meanAmmoniaPhase2');
R3 = corr(flowRatesPhase3', meanAmmoniaPhase3');

disp('  for all trials')
disp(['    correlation between phase 1 flow rate and phase 1 mean ammonia: ', num2str(R1)])
disp(['    correlation between phase 2 flow rate and phase 2 mean ammonia: ', num2str(R2)])
disp(['    correlation between phase 3 flow rate and phase 3 mean ammonia: ', num2str(R3)])

% The correlation coefficient for phase 2 flow rate and ammonia is
% approximately 0.28978, signifying a weak positive linear association

% a positive value suggests that as phase 2 flow rate increases, the
% ammonia level also has a tendency to increase, this relationship is weak,
% implying that flow rate alone might not be a strong predictor of ammonia
% levels. also no ammonia was detected in phase 1 or phase 3, which is
% consistent with experimental expectations



%% linear regression
disp('linear regression');

% fit a simple linear regression model to see how flow rate predicts the
% mean ammonia reading for each phase

lm1 = fitlm(flowRatesPhase1, meanAmmoniaPhase1, 'Linear');
lm2 = fitlm(flowRatesPhase2, meanAmmoniaPhase2, 'Linear');
lm3 = fitlm(flowRatesPhase3, meanAmmoniaPhase3, 'Linear');

disp(lm1);
disp(lm2);
disp(lm3);


% First model: All coefficients are 0, and R-squared is NaN. This indicates
% an issue with model, possibly no variation in dependent or
% independent variable.

% Second model: predictor x1 has a p-value of 0.27631, meaning it's not
% statistically significant at conventional levels (like 0.05). The
% R-squared of 0.084 suggests that model explains about 8.4% of the
% variability in dependent variable.

% Third model: Has an insignificant predictor with a p-value of 0.5557.
% This model explains only about 2.74% of variability in dependent
% variable.



%% visualization
disp('visualization')

% plotting volumetric flow rate against ammonia gas reading for each trial
% or phase may reveal patterns and trends, if flow rate is a significant
% factor, we might observe a consistent trend across trials or phases

% set up figure
figure;

% colors for phase 1, 2, and 3 
colors = {'r', 'g', 'b'}; 

% loop through each phase
for phaseNum = 1:3
    
    % preallocate for storing data across all trials
    allFlowRates = [];
    allAmmoniaReadings = [];
    
    % loop through each trial
    for i = 1:numTrials

        trialNameChar = ['trial', num2str(i)];
        phaseName = ['phase', num2str(phaseNum), 'TT'];
        
        % get volumetric flow rate for current trial and phase
        flowRates = DS.(trialNameChar).(phaseName).volumetricFlowRateStandardizedSCCM;

        % get ammona readings for current trial and phase
        ammoniaReadings = DS.(trialNameChar).(phaseName).Sensor1GasReading;
        
        % append data to arrays
        allFlowRates = [allFlowRates; flowRates];
        allAmmoniaReadings = [allAmmoniaReadings; ammoniaReadings];

    end % <-- end for
    
    % plot data for current phase
    subplot(3, 1, phaseNum);
    scatter(allFlowRates, allAmmoniaReadings, 10, colors{phaseNum}, 'filled'); % '10' sets marker size
    title(['Phase ', num2str(phaseNum)]);
    xlabel('Volumetric Flow Rate (Standardized SCCM)');
    ylabel('Ammonia Gas Reading');
    grid on;

end % <-- end for

% adjust layout
sgtitle('Volumetric Flow Rate vs. Ammonia Gas Reading (All Trials)');

% save current figure
saveCurrentFigureAsImage('volumetric_flow_rate_vs_ammonia_gas_reading', ...
    7.5, 7.5);



%% plot mean variables for each variable name for phase 2
disp('plot mean variables for phase 2')

% initialize cell arrays to store results
varNames = {};
meanRows = [];
semRows = [];

% get list of trials
trialNamesCell = fieldnames(DS);

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};
    
    % get variable names for phase2Stats for current trial we only need to
    % do this once since variable names are the same across trials
    if i == 1  

        varNames = DS.(trialNameChar).phase2Stats.Properties.VariableNames;

    end % <-- end if
    
    % get mean and sem rows for each variable for plotting
    for j = 1:numel(varNames)

        varName = varNames{j};
        meanRows(i, j) = DS.(trialNameChar).phase2Stats{'mean', varName};
        semRows(i, j) = DS.(trialNameChar).phase2Stats{'sem', varName};

    end % <-- end for

end % <-- end for

% number of trials and variables
[numTrials, numVars] = size(meanRows);

% Create a colormap for 16 different colors
colors = lines(numTrials);

% loop through each variable to create individual plots
for v = 1:numVars

    % create a new figure for each variable
    figure; 
    hold on;
    
    % bar graph with different colors for each bar
    b = bar(meanRows(:, v), 'FaceColor', 'flat');
    b.CData = colors;  % Assign the colors to the bars
    
    % error bars
    xCenters = b.XEndPoints;  % X centers of the bars
    hErrBar = errorbar(xCenters, meanRows(:, v), semRows(:, v), ...
                   'k', 'LineStyle', 'none');
    hErrBar.LineWidth = 1;  % Set error bar line width
    
    % x-axis labels
    xticks(1:numTrials);

    % numbers 1 to 16
    xticklabels(arrayfun(@num2str, 1:numTrials, 'UniformOutput', false));  
    
    % label for the x-axis
    xlabel('Trials');
    
    % title, y-axis label
    title(['Phase 2 Mean ' varNames{v} ' (SEM error bars)']);
    ylabel(varNames{v});
    
    hold off;

    % save current figure
    saveCurrentFigureAsImage(strcat('mean_', num2str(v), '_', varNames{v}));

end % <-- end for



%% compare volume of ammonium hydroxide to ammonia gas readings
disp('compare volume of ammonium hydroxide to ammonia gas readings');

% get list of trials
trialNamesCell = fieldnames(DS);
volumeAmmonium = zeros(numel(trialNamesCell), 1);
meanAmmoniaPhase2 = zeros(numel(trialNamesCell), 1);

% get mean reading for control trial (Trial 8)
controlMean = mean(DS.trial8.phase2TT.Sensor1GasReading, "omitnan");

% loop through each trial
for i = 1:numel(trialNamesCell)

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % get ammonium volume for current trial
    volumeAmmonium(i) = M.volumeNH4OHUMOLL(i);

    % get mean sensor reading for phase 2 and adjust by subtracting control
    % value
    if i ~= 8 % don't adjust the control trial

        meanAmmoniaPhase2(i) = ...
            mean(DS.(['trial', num2str(i)]).phase2TT.Sensor1GasReading, ...
                      "omitnan") - controlMean;

    else

        meanAmmoniaPhase2(i) = controlMean;

    end % <-- end if

end % <-- end for

% scatter plot for phase 2
figure;

% loop again for scatter plot with colors and legend
hold on;
colors = hsv(numel(trialNamesCell));

for i = 1:numel(trialNamesCell)

    scatter(volumeAmmonium(i), meanAmmoniaPhase2(i), ...
            50, colors(i,:), 'DisplayName', sprintf('Trial %d', i));

end % <-- end for

xlabel('Ammonium (NH4+) (PPM = mg/L)');
xRange = max(volumeAmmonium) - min(volumeAmmonium);
xlim([min(volumeAmmonium)-0.10*xRange, max(volumeAmmonium)+0.10*xRange]);
ylabel('Adjusted Mean Ammonia (NH3) (PPM = mg/L)');
yRange = max(meanAmmoniaPhase2) - min(meanAmmoniaPhase2);
ylim([min(meanAmmoniaPhase2)-0.10*yRange, max(meanAmmoniaPhase2)+0.10*yRange]);
title('Phase 2 Ammonium (NH4+) vs. Adjusted Mean Ammonia (NH3)');
legend('Location', 'eastoutside');
hold off;

% calculate correlation for phase 2
[R, P] = corrcoef(volumeAmmonium, meanAmmoniaPhase2);
disp(['  correlation coefficient for phase 2: ', num2str(R(1,2))]);
disp(['  p-value for phase 2: ', num2str(P(1,2))]);

saveCurrentFigureAsImage('volume_of_ammonium_and_adjusted_mean_ammonia_phase_2')

% calculate correlation for phase 2
%     the Pearson correlation coefficient is trying to quantify the
%     strength and direction of the linear relationship between the two
%     datasets, and the p-value, represents the statistical significance of
%     the observed correlation

% correlation coefficient for phase 2: 0.66776: suggests a moderate positive
% linear relationship between the volume of ammonium hydroxide and the mean
% ammonia gas reading during phase 2. In other words, as the volume of
% ammonium hydroxide increases, the mean ammonia gas reading during phase 2
% tends to increase to a moderate extent.
% 
% p-value for phase 2: 0.0047022: a p-value below 0.05 is considered
% statistically significant, implying that there's a low probability that
% the observed correlation occurred by random chance. This means that the
% positive correlation between the volume of ammonium hydroxide and the
% mean ammonia gas reading during phase 2 is statistically significant, and
% it's unlikely to be due to random chance
% 
% conclusion: analysis suggests that there's a statistically significant
% moderate positive relationship between the volume of ammonium hydroxide
% and the mean ammonia gas readings in phase 2, since as we add more
% ammonium hydroxide, we can expect an increase in the mean ammonia gas
% reading during phase 2, at least to a certain extent



%% analysis based on presence of PFC
disp('analysis based on presence of PFC');

% control trial ammonia reading
controlAmmonia = mean(DS.trial8.phase2TT.Sensor1GasReading, "omitnan");

% group data based on PFC
trialsWithoutPFC = 1:13;
trialsWithPFC = 14:16;

% preallocate for mean ammonia readings adjusted for control
adjustedAmmoniaWithoutPFC = zeros(length(trialsWithoutPFC), 1);
adjustedAmmoniaWithPFC = zeros(length(trialsWithPFC), 1);

% mean ammonia readings for trials without PFC adjusted for control
for i = trialsWithoutPFC
    adjustedAmmoniaWithoutPFC(i) = ...
        mean(DS.(['trial', num2str(i)]).phase2TT.Sensor1GasReading, ...
                  "omitnan") - controlAmmonia;
end 

% mean ammonia readings for trials with PFC adjusted for control
for i = trialsWithPFC
    adjustedAmmoniaWithPFC(i - length(trialsWithoutPFC)) = ...
        mean(DS.(['trial', num2str(i)]).phase2TT.Sensor1GasReading, ...
                  "omitnan") - controlAmmonia;
end 

% get overall average for both groups
avgAmmoniaWithoutPFC = mean(adjustedAmmoniaWithoutPFC);
avgAmmoniaWithPFC = mean(adjustedAmmoniaWithPFC);

% display results
disp(['  Adjusted average ammonia reading without PFC: ', ...
      num2str(avgAmmoniaWithoutPFC)]);
disp(['  Adjusted average ammonia reading with PFC: ', ...
      num2str(avgAmmoniaWithPFC)]);

% statistical comparison using t-test
[h, p] = ttest2(adjustedAmmoniaWithoutPFC, adjustedAmmoniaWithPFC);
disp(['  p-value for difference between groups: ', num2str(p)]);

% significance level (e.g., 0.05)
if p < 0.05

    disp(['  The difference in adjusted ammonia readings between ' ...
          'the groups is statistically significant.']);

else

    disp(['  The difference in adjusted ammonia readings between ' ...
          'the groups is not statistically significant.']);

end % <-- end if


% adjusted average ammonia readings: after accounting for the control, on
% average, the trials without PFC showed an adjusted ammonia reading of
% 1.771, while the trials with PFC showed an adjusted ammonia reading of
% 2.2976
% 
% statistical significance: a p-value of 0.84248 is much greater than the
% commonly used significance threshold of 0.05, indicating that the
% observed differences between the two groups could easily have occurred by
% random chance. based on this data, the introduction of PFC doesn't
% have a statistically significant impact on ammonia readings, at least as
% measured in these trials



%% pairwise comparisons for similar ammonium hydroxide concentrations
disp('pairwise comparisons for similar ammonium hydroxide concentrations')


% compare trials that have similar or same volume of ammonium hydroxide
% (volumeNH4OHUL) to discern the effect of other factors like PFC

% trial  volumeRODIWaterML  volumePFCML   volumeNH4OHUL  Sensor1GasReading
% 1      100.00              0.00         1515.00         5.86
% 2      100.00              0.00           15.14         0.00
% 3      100.00              0.00           22.70         0.00
% 4      100.00              0.00           30.28         0.00
% 5      100.00              0.00           37.85         0.00
% 6      100.00              0.00           45.42         0.00
% 7      100.00              0.00           52.99         0.00
% 8      100.00              0.00            0.00         0.00
% 9      100.00              0.00           15.14         0.00
% 10     100.00              0.00         1514.00        15.37
% 11     100.00              0.00          151.40         0.60
% 12     100.00              0.00          151.40         0.51
% 13     100.00              0.00          151.40         0.69
% 14      50.00             50.00          757.00         2.15
% 15      50.00             50.00          757.00         2.45
% 16      50.00             50.00          757.00         2.29

% identify pairs of trials with similar ammonium hydroxide concentrations
% based on the given data above from meta.csv, the possible pairs could be:
pairs = {[ 1, 10],     ... % ~1515.00 uL of ammonium hydroxide
         [11, 12, 13], ... %   151.40 uL of ammonium hydroxide
         [14, 15, 16], ... %   757.00 uL of ammonium hydroxide
        }; 


% loop through each pair and perform pairwise comparison
for k = 1:length(pairs)

    currentPair = pairs{k};
    
    % get ammonia readings for each trial in pair
    ammoniaReadingsCell = cell(1, length(currentPair));
    for j = 1:length(currentPair)

        ammoniaReadingsCell{j} = ...
            DS.(['trial', num2str(currentPair(j))]).phase2TT.Sensor1GasReading;

    end % <-- end for
    
    % pairwise t-tests between trials in pair
    for m = 1:(length(currentPair) - 1)

        for n = (m+1):length(currentPair)

            [h, p] = ttest2(ammoniaReadingsCell{m}, ammoniaReadingsCell{n});
            disp(['  Pairwise comparison between Trial ', ...
                  num2str(currentPair(m)), ' and Trial ', ...
                  num2str(currentPair(n)), ': p-value = ', num2str(p)]);

        end % <-- end for

    end % <-- end for

end % <-- end for

% Trials [1, 10]: ~1515 uL of ammonium hydroxide
%     - Trial 1 vs. Trial 10: p-value = 0
%     - p-value indicates statistically significant difference between 
%       outcomes of Trials 1 and 10, even though both have almost the same
%       volume of ammonium hydroxide
%     - p-value of 0 suggests differences between these two trials are not
%       due to random chance
% 
% Trials [11, 12, 13]: ~151.4 uL of ammonium hydroxide
%     - Trial 11 vs. Trial 12: p-value = 4.3721e-05
%     - Trial 11 vs. Trial 13: p-value = 1.1782e-05
%     - Trial 12 vs. Trial 13: p-value = 1.8034e-15
%     - these low p-values indicate significant differences between 
%       outcomes of these trials, despite them having very similar ammonium
%       hydroxide concentrations
% 
% Trials [14, 15, 16]: ~757 uL of ammonium hydroxide
%     - Trial 14 vs. Trial 15: p-value = 2.1386e-07
%     - Trial 14 vs. Trial 16: p-value = 0.015725
%     - Trial 15 vs. Trial 16: p-value = 0.009133
%     - all comparisons here show statistically significant differences 
%       between the outcomes of these trials



%% get ammonia plot of all trials
disp('get ammonia plot of all trials')

% get list of trials
trialNamesCell = fieldnames(DS);

% number of trials
numTrials = numel(trialNamesCell);

% porepare a matrix for subplots
numRows = ceil(sqrt(numTrials)); 
numCols = ceil(numTrials / numRows);

% create a new figure
figure;

% use tiledlayout for plotting
t = tiledlayout(numRows, numCols, 'TileSpacing', 'compact');
title(t, 'Ammonia Readings Across All Trials and Phases', ...
      'FontSize', 14, 'FontWeight', 'bold');

% create empty arrays to store handles for plot lines
h = zeros(3,1);

% colors for each phase
phaseColors = ['r', 'b', 'g'];

% define the gap between phases
gap = 0.5;  % in seconds

% loop through each trial
for i = 1:numTrials

    % get current trial name
    trialNameChar = trialNamesCell{i};

    % create a new tile for each trial
    ax = nexttile;
    hold on;

    % initialize elapsed time
    elapsed = 0;
    
    % loop through each phase
    for phaseNum = 1:3

        % fetch phase data
        phaseDataName = strcat('phase', num2str(phaseNum), 'TT');
        phaseData = DS.(trialNameChar).(phaseDataName);
        
        % calculate duration of current phase in seconds
        duration = seconds(phaseData.dateTime(end) - phaseData.dateTime(1));

        % calculate elapsed time for current phase
        elapsedTime = elapsed + ...
            (0:duration/(numel(phaseData.Sensor1GasReading)-1):duration)';
        elapsed = elapsed + duration + gap;

        % plot data for current phase
        plot(ax, elapsedTime, phaseData.Sensor1GasReading, ...
             phaseColors(phaseNum), ...
             'DisplayName', ['Phase ' num2str(phaseNum)]);
        % xline(elapsed, '--', strcat('phase', num2str(phaseNum)), ...
        %       'LabelHorizontalAlignment', 'left', ...
        %       'LabelVerticalAlignment', 'bottom');

    end % end for
    
    title(ax, ['Trial ' num2str(i)]);
    ylabel(ax, 'Ammonia (PPM)');
    xlabel(ax, 'Elapsed Time (seconds)');
    % grid(ax, 'on');
    % ylim([0, 30]);
    % xlim([0, 6000]);

    hold off;

end % end for

% create a single legend at bottom using handles from first trial
lg = legend(ax, 'Location', 'southoutside', 'Orientation', 'horizontal');
lg.Layout.Tile = 'south';

% save current figure as png
saveCurrentFigureAsImage('gas_ammonia', 8.5, 8.5);



%% statistics finished
disp('====statistics finished====')



%% program finished
disp('program finished')



%% logging stop
% stop logging to txt file
diary off;



%% FUNCTIONS
% ------------------------------------------------------------------------




function removeNaNsFromCSV(fileName)

    % INPUT EXPECTS fileName
    %     - full path to CSV file to be processed
    % OUTPUT NONE
    %     - specified CSV file is modified in-place, with "NaN" entries
    %       replaced by empty strings

    fileContent = fileread(fileName);
    % replace 'NaN' with empty string
    fileContent = strrep(fileContent, 'NaN', ''); 
    fid = fopen(fileName, 'w');
    fwrite(fid, fileContent);
    fclose(fid);

end % <-- end function



function outputTable = descStat(inputTable)

    % this function computes various descriptive statistics (n, min, max,
    % mean, median, mode, std, var, rms, sem) for columns of an input
    % table, and then returns a table where each row contains those
    % statistics. the input can have NaNs in the column values
    %
    % INPUT:
    %   - inputTable: a 2D table or timetable where each column will have
    %     statistics computed
    %
    % OUTPUT:
    %   - outputTable: a 2D table containing computed statistics for each
    %     column of input table, where each row of tableOutput corresponds
    %     to a statistic (e.g., n, min, max, ...)

    % get column names from input table or timetable
    inputColNamesCell = inputTable.Properties.VariableNames; 

    % convert table to array for statistical functions
    inputDouble = table2array(inputTable); 
    
    % compute basic statistics.
    N = sum(~isnan(inputDouble)); % number of rows (samples)
    STD = std(inputDouble, 'omitnan'); % standard deviation (STD)
    SEM = STD ./ sqrt(N);  % standard error of the mean (SEM)

    % consolidate statistics for table creation.
    stats = ...
        [   N; ... 
            min(inputDouble, [], 'omitnan'); ... % minimum elements of an array
            max(inputDouble, [], 'omitnan'); ... % maximum elements of an array
            mean(inputDouble,    'omitnan'); ... % average or mean value
            median(inputDouble,  'omitnan'); ... % median value
            mode(inputDouble); ... % mode, or most frequent value (NaN ignored)
            STD; ... 
            var(inputDouble,     'omitnan'); ... % variance
            rms(inputDouble,     'omitnan'); ... % root mean square
            SEM]; 

    % list of computed statistics
    statsFunctions = ...
        [   "n", ...
            "min", ...
            "max", ...
            "mean", ...
            "median", ...
            "mode", ...
            "std", ...
            "var", ...
            "rms", ...
            "sem"]; 

    % convert statistics array to output table
    outputTable = ...
        array2table(stats, ...
                    'VariableNames', inputColNamesCell, ...
                    'RowNames', statsFunctions); 

end % <-- end function



function saveCurrentFigureAsImage(figureTitle, width, height)

    % this funcction saves the current figure as a PNG image file

    % INPUT:
    %   - figureTitle (string): title of the figure, used as the filename
    %   - width (numeric, optional): width of the image in inches
    %   - height (numeric, optional): height of the image in inches
    % OUTPUT:
    %   a PNG image file saved to the current working directory

    % check if width is provided, if not, set to default
    if nargin < 2 || isempty(width)

        width = 7.5; % default width in inches

    end % <-- end if

    % check if height is provided, if not, set to default
    if nargin < 3 || isempty(height)

        height = 4.21875; % default height in inches

    end % <-- end if

    % replace non-alphanumeric characters in figuretitle with "_"
    figureTitle = regexprep(figureTitle, "\W", "_"); 


    % set the size and position of the figure
    %     position [left bottom width height] in inches
    set(gcf, 'units', 'inches', 'position', [0, 0, width, height]);

    % try to save the figure as a PNG file
    try

        exportgraphics(gcf, strcat("image_", figureTitle, ".png"), ...
                       "Resolution", 300);

    catch ME

        % display an error message if saving fails
        disp(['Error: ', ME.message]); 

    end % <-- end try

end % <-- end function


```
